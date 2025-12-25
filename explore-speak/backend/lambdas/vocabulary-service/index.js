const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');

const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' }));

const VOCABULARY_TABLE = process.env.VOCABULARY_TABLE || 'ExploreSpeak-VocabularyCards';
const REVIEW_SESSIONS_TABLE = process.env.REVIEW_SESSIONS_TABLE || 'ExploreSpeak-ReviewSessions';

// Helper function to create HTTP response
const createResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  body: JSON.stringify(body),
});

// SM-2 Algorithm Implementation
function calculateNextReview(card, quality) {
  let { easeFactor, interval, repetitions } = card;

  if (quality < 3) {
    // Incorrect response - reset
    repetitions = 0;
    interval = 1;
  } else {
    // Correct response
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  easeFactor = Math.max(1.3, easeFactor);

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    easeFactor,
    interval,
    repetitions,
    nextReviewDate: nextReviewDate.toISOString(),
  };
}

// Get cards due for review
async function getDueCards(userId, language) {
  try {
    const now = new Date().toISOString();

    const params = {
      TableName: VOCABULARY_TABLE,
      IndexName: 'userId-nextReviewDate-index',
      KeyConditionExpression: 'userId = :userId AND nextReviewDate <= :now',
      FilterExpression: '#lang = :language',
         ExpressionAttributeNames: {
           '#lang': 'language'
         },
      ExpressionAttributeValues: {
        ':userId': userId,
        ':now': now,
        ':language': language,
      },
    };

    const result = await dynamodb.send(new QueryCommand(params));

    return {
      cards: result.Items || [],
      totalDue: result.Items?.length || 0,
      newCards: result.Items?.filter(card => card.repetitions === 0).length || 0,
      reviewCards: result.Items?.filter(card => card.repetitions > 0).length || 0,
    };
  } catch (error) {
    console.error('Error getting due cards:', error);
    throw error;
  }
}

// Update card after review
async function updateCard(cardId, userId, quality, responseTime) {
  try {
    // Get current card
    const getParams = {
      TableName: VOCABULARY_TABLE,
      Key: { cardId, userId },
    };

    const result = await dynamodb.send(new GetCommand(getParams));
    const card = result.Item;

    if (!card) {
      throw new Error('Card not found');
    }

    // Calculate next review using SM-2
    const sm2Result = calculateNextReview(card, quality);

    // Update card
    const updateParams = {
      TableName: VOCABULARY_TABLE,
      Key: { cardId, userId },
      UpdateExpression: `
        SET easeFactor = :easeFactor,
            interval = :interval,
            repetitions = :repetitions,
            nextReviewDate = :nextReviewDate,
            lastReviewDate = :lastReviewDate,
            correctCount = :correctCount,
            incorrectCount = :incorrectCount,
            averageResponseTime = :averageResponseTime,
            updatedAt = :updatedAt
      `,
      ExpressionAttributeValues: {
        ':easeFactor': sm2Result.easeFactor,
        ':interval': sm2Result.interval,
        ':repetitions': sm2Result.repetitions,
        ':nextReviewDate': sm2Result.nextReviewDate,
        ':lastReviewDate': new Date().toISOString(),
        ':correctCount': quality >= 3 ? card.correctCount + 1 : card.correctCount,
        ':incorrectCount': quality < 3 ? card.incorrectCount + 1 : card.incorrectCount,
        ':averageResponseTime': calculateAverageResponseTime(card.averageResponseTime, responseTime, card.correctCount + card.incorrectCount),
        ':updatedAt': new Date().toISOString(),
      },
      ReturnValues: 'ALL_NEW',
    };

    const updateResult = await dynamodb.send(new UpdateCommand(updateParams));

    return {
      success: true,
      updatedCard: updateResult.Attributes,
      nextReviewDate: sm2Result.nextReviewDate,
      message: quality >= 3 ? 'Great job! Card scheduled for review.' : 'Keep practicing! Card will be reviewed again soon.',
    };
  } catch (error) {
    console.error('Error updating card:', error);
    throw error;
  }
}

// Add new vocabulary cards from quest completion
async function addVocabularyCards(userId, questId, vocabulary, language) {
  try {
    const cards = vocabulary.map(item => ({
      cardId: `${userId}-${questId}-${item.word}`,
      userId,
      wordId: `${questId}-${item.word}`,
      word: item.word,
      translation: item.translation,
      language,
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      nextReviewDate: new Date().toISOString(), // Due immediately
      lastReviewDate: new Date().toISOString(),
      correctCount: 0,
      incorrectCount: 0,
      averageResponseTime: 0,
      sourceQuestId: questId,
      exampleSentence: item.exampleSentence || '',
      difficulty: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // Batch write cards
    const batches = [];
    for (let i = 0; i < cards.length; i += 25) {
      const batch = cards.slice(i, i + 25);
      batches.push(batch);
    }

    for (const batch of batches) {
      const params = {
        RequestItems: {
          [VOCABULARY_TABLE]: batch.map(card => ({
            PutRequest: { Item: card },
          })),
        },
      };
      await dynamodb.send(new BatchWriteCommand(params));
    }

    return {
      success: true,
      cardsAdded: cards.length,
      message: `Added ${cards.length} new vocabulary cards`,
    };
  } catch (error) {
    console.error('Error adding vocabulary cards:', error);
    throw error;
  }
}

// Get vocabulary statistics
async function getVocabularyStats(userId, language) {
  try {
    const params = {
      TableName: VOCABULARY_TABLE,
      IndexName: 'userId-language-index',
      KeyConditionExpression: 'userId = :userId AND #lang = :language',
         ExpressionAttributeNames: {
           '#lang': 'language'
         },
      ExpressionAttributeValues: {
        ':userId': userId,
        ':language': language,
      },
    };

    const result = await dynamodb.send(new QueryCommand(params));
    const cards = result.Items || [];

    const now = new Date().toISOString();
    const dueToday = cards.filter(card => card.nextReviewDate <= now).length;
    const masteredCards = cards.filter(card => card.repetitions >= 5).length;
    const learningCards = cards.filter(card => card.repetitions > 0 && card.repetitions < 5).length;
    const newCards = cards.filter(card => card.repetitions === 0).length;

    // Calculate retention rate
    const totalAttempts = cards.reduce((sum, card) => sum + card.correctCount + card.incorrectCount, 0);
    const totalCorrect = cards.reduce((sum, card) => sum + card.correctCount, 0);
    const averageRetention = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

    return {
      userId,
      language,
      totalCards: cards.length,
      masteredCards,
      learningCards,
      newCards,
      dueToday,
      averageRetention,
    };
  } catch (error) {
    console.error('Error getting vocabulary stats:', error);
    throw error;
  }
}

// Start review session
async function startReviewSession(userId, language) {
  try {
    const sessionId = `${userId}-${Date.now()}`;
    const session = {
      sessionId,
      userId,
      language,
      startedAt: new Date().toISOString(),
      cardsReviewed: 0,
      cardsCorrect: 0,
      cardsIncorrect: 0,
      averageResponseTime: 0,
      sessionDuration: 0,
    };

    await dynamodb.send(new PutCommand({
      TableName: REVIEW_SESSIONS_TABLE,
      Item: session,
    }));

    return { success: true, sessionId, session };
  } catch (error) {
    console.error('Error starting review session:', error);
    throw error;
  }
}

// Complete review session
async function completeReviewSession(sessionId, userId, stats) {
  try {
    const params = {
      TableName: REVIEW_SESSIONS_TABLE,
      Key: { sessionId, userId },
      UpdateExpression: `
        SET completedAt = :completedAt,
            cardsReviewed = :cardsReviewed,
            cardsCorrect = :cardsCorrect,
            cardsIncorrect = :cardsIncorrect,
            averageResponseTime = :averageResponseTime,
            sessionDuration = :sessionDuration
      `,
      ExpressionAttributeValues: {
        ':completedAt': new Date().toISOString(),
        ':cardsReviewed': stats.cardsReviewed,
        ':cardsCorrect': stats.cardsCorrect,
        ':cardsIncorrect': stats.cardsIncorrect,
        ':averageResponseTime': stats.averageResponseTime,
        ':sessionDuration': stats.sessionDuration,
      },
    };

    await dynamodb.send(new UpdateCommand(params));

    return { success: true, message: 'Review session completed' };
  } catch (error) {
    console.error('Error completing review session:', error);
    throw error;
  }
}

// Helper function
function calculateAverageResponseTime(currentAvg, newTime, totalAttempts) {
  if (totalAttempts === 0) return newTime;
  return Math.round((currentAvg * totalAttempts + newTime) / (totalAttempts + 1));
}

// Lambda handler
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const { httpMethod, path } = event;
  const body = event.body ? JSON.parse(event.body) : {};
  const queryParams = event.queryStringParameters || {};

  try {
    // Get due cards
    if (httpMethod === 'GET' && path === '/vocabulary/due') {
      const { userId, language } = queryParams;
      const result = await getDueCards(userId, language);
      return createResponse(200, result);
    }

    // Update card after review
    if (httpMethod === 'POST' && path === '/vocabulary/update') {
      const { cardId, userId, quality, responseTime } = body;
      const result = await updateCard(cardId, userId, quality, responseTime);
      return createResponse(200, result);
    }

    // Add vocabulary cards from quest
    if (httpMethod === 'POST' && path === '/vocabulary/add') {
      const { userId, questId, vocabulary, language } = body;
      const result = await addVocabularyCards(userId, questId, vocabulary, language);
      return createResponse(200, result);
    }

    // Get vocabulary statistics
    if (httpMethod === 'GET' && path === '/vocabulary/stats') {
      const { userId, language } = queryParams;
      const result = await getVocabularyStats(userId, language);
      return createResponse(200, result);
    }

    // Start review session
    if (httpMethod === 'POST' && path === '/vocabulary/session/start') {
      const { userId, language } = body;
      const result = await startReviewSession(userId, language);
      return createResponse(200, result);
    }

    // Complete review session
    if (httpMethod === 'POST' && path === '/vocabulary/session/complete') {
      const { sessionId, userId, stats } = body;
      const result = await completeReviewSession(sessionId, userId, stats);
      return createResponse(200, result);
    }

    return createResponse(404, { error: 'Not found' });
  } catch (error) {
    console.error('Error:', error);
    return createResponse(500, { error: error.message });
  }
};