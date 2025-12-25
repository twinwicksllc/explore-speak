const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' }));

const LEARNER_PROFILES_TABLE = process.env.LEARNER_PROFILES_TABLE || 'ExploreSpeak-LearnerProfiles';
const PERFORMANCE_TABLE = process.env.PERFORMANCE_TABLE || 'ExploreSpeak-Performance';
const QUESTS_TABLE = process.env.QUESTS_TABLE || 'ExploreSpeak-Quests';
const PROGRESS_TABLE = process.env.PROGRESS_TABLE || 'ExploreSpeak-Progress';

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

// Get or create learner profile
async function getLearnerProfile(userId, language) {
  try {
    const params = {
      TableName: LEARNER_PROFILES_TABLE,
      Key: { userId, language },
    };

    const result = await dynamodb.send(new GetCommand(params));

    if (result.Item) {
      return result.Item;
    }

    // Create new profile
    const newProfile = {
      userId,
      language,
      overallLevel: 'A1',
      levelProgress: 0,
      vocabularySize: 0,
      grammarMastery: {},
      averageSessionLength: 20,
      preferredTimeOfDay: 'morning',
      learningPace: 'moderate',
      strengthAreas: [],
      weaknessAreas: [],
      streakDays: 0,
      totalStudyTime: 0,
      completionRate: 0,
      lastActiveDate: new Date().toISOString(),
      currentDifficulty: 3,
      optimalChallengeLevel: 3,
      frustrationThreshold: 60,
      boredomThreshold: 90,
      favoriteQuestTypes: [],
      preferredExerciseTypes: [],
      culturalInterests: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await dynamodb.send(new PutCommand({
      TableName: LEARNER_PROFILES_TABLE,
      Item: newProfile,
    }));

    return newProfile;
  } catch (error) {
    console.error('Error getting learner profile:', error);
    throw error;
  }
}

// Update learner profile after quest completion
async function updateLearnerProfile(userId, language, questId, score, timeSpent) {
  try {
    const profile = await getLearnerProfile(userId, language);
    
    // Get performance history
    const performanceHistory = await getPerformanceHistory(userId, language);
    
    // Calculate new metrics
    const recentScores = performanceHistory.slice(-5).map(p => p.score);
    recentScores.push(score);
    
    const optimalChallenge = calculateOptimalChallenge(recentScores, profile.currentDifficulty);
    const weaknesses = analyzeWeaknesses(performanceHistory);
    const strengths = analyzeStrengths(performanceHistory);
    
    // Update profile
    const params = {
      TableName: LEARNER_PROFILES_TABLE,
      Key: { userId, language },
      UpdateExpression: `
        SET totalStudyTime = :totalStudyTime,
            lastActiveDate = :lastActiveDate,
            currentDifficulty = :currentDifficulty,
            optimalChallengeLevel = :optimalChallengeLevel,
            weaknessAreas = :weaknessAreas,
            strengthAreas = :strengthAreas,
            updatedAt = :updatedAt
      `,
      ExpressionAttributeValues: {
        ':totalStudyTime': profile.totalStudyTime + timeSpent,
        ':lastActiveDate': new Date().toISOString(),
        ':currentDifficulty': optimalChallenge,
        ':optimalChallengeLevel': optimalChallenge,
        ':weaknessAreas': weaknesses.map(w => w.topic),
        ':strengthAreas': strengths.map(s => s.topic),
        ':updatedAt': new Date().toISOString(),
      },
      ReturnValues: 'ALL_NEW',
    };

    const result = await dynamodb.send(new UpdateCommand(params));
    
    return {
      success: true,
      profile: result.Attributes,
    };
  } catch (error) {
    console.error('Error updating learner profile:', error);
    throw error;
  }
}

// Save performance metrics
async function savePerformanceMetrics(userId, questId, metrics) {
  try {
    const performanceId = `${userId}-${questId}-${Date.now()}`;
    
    const performance = {
      performanceId,
      userId,
      questId,
      score: metrics.score,
      timeSpent: metrics.timeSpent,
      attemptsCount: metrics.attemptsCount || 1,
      hintsUsed: metrics.hintsUsed || 0,
      completedAt: new Date().toISOString(),
      difficulty: metrics.difficulty || 5,
      topicscovered: metrics.topics || [],
    };

    await dynamodb.send(new PutCommand({
      TableName: PERFORMANCE_TABLE,
      Item: performance,
    }));

    return { success: true, performanceId };
  } catch (error) {
    console.error('Error saving performance metrics:', error);
    throw error;
  }
}

// Get performance history
async function getPerformanceHistory(userId, language, limit = 20) {
  try {
    const params = {
      TableName: PERFORMANCE_TABLE,
      IndexName: 'userId-completedAt-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      ScanIndexForward: false, // Most recent first
      Limit: limit,
    };

    const result = await dynamodb.send(new QueryCommand(params));
    return result.Items || [];
  } catch (error) {
    console.error('Error getting performance history:', error);
    throw error;
  }
}

// Get personalized quest recommendations
async function getPersonalizedQuests(userId, language, limit = 5) {
  try {
    const profile = await getLearnerProfile(userId, language);
    
    // Get all quests for the language
    const questsParams = {
      TableName: QUESTS_TABLE,
      FilterExpression: '#lang = :language',
         ExpressionAttributeNames: {
           '#lang': 'language'
         },
      ExpressionAttributeValues: {
        ':language': language,
      },
    };
    
    const questsResult = await dynamodb.send(new ScanCommand(questsParams));
    const allQuests = questsResult.Items || [];
    
    // Get completed quests
    const progressParams = {
      TableName: PROGRESS_TABLE,
      IndexName: 'userId-status-index',
      KeyConditionExpression: 'userId = :userId',
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':userId': userId,
        ':status': 'completed',
      },
    };
    
    const progressResult = await dynamodb.send(new QueryCommand(progressParams));
    const completedQuestIds = (progressResult.Items || []).map(p => p.questId);
    
    // Score and rank quests
    const recommendations = allQuests
      .filter(quest => !completedQuestIds.includes(quest.questId))
      .map(quest => scoreQuest(quest, profile, completedQuestIds))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
    
    return recommendations;
  } catch (error) {
    console.error('Error getting personalized quests:', error);
    throw error;
  }
}

// Score quest for recommendation
function scoreQuest(quest, profile, completedQuestIds) {
  let score = 0;
  const reasoning = [];
  
  // 1. Difficulty Match (40% weight)
  const questDifficulty = getLevelDifficulty(quest.level);
  const difficultyDiff = Math.abs(questDifficulty - profile.currentDifficulty);
  const difficultyMatch = Math.max(0, 1 - difficultyDiff / 10);
  score += difficultyMatch * 40;
  
  if (difficultyMatch > 0.8) {
    reasoning.push('Perfect difficulty level for you');
  }
  
  // 2. Weakness Targeting (30% weight)
  const questTopics = extractQuestTopics(quest);
  const addressesWeakness = questTopics.some(topic => 
    profile.weaknessAreas.includes(topic)
  );
  if (addressesWeakness) {
    score += 30;
    reasoning.push('Helps improve your weak areas');
  }
  
  // 3. Interest Alignment (20% weight)
  const culturalContext = quest.content?.preQuest?.culturalContext?.toLowerCase() || '';
  const matchesInterest = profile.culturalInterests.some(interest =>
    culturalContext.includes(interest.toLowerCase())
  );
  if (matchesInterest) {
    score += 20;
    reasoning.push('Matches your interests');
  }
  
  // 4. Language Match (10% weight)
  if (quest.language === profile.language) {
    score += 10;
  }
  
  // Calculate estimated success rate
  const estimatedSuccess = Math.round(difficultyMatch * 100);
  
  return {
    questId: quest.questId,
    title: quest.title,
    language: quest.language,
    level: quest.level,
    relevanceScore: Math.round(score),
    difficulty: questDifficulty,
    estimatedSuccessRate: estimatedSuccess,
    reasoning: reasoning.join('. ') || 'Good next step in your learning journey',
    prerequisites: [],
    learningObjectives: quest.content?.preQuest?.learningObjectives || [],
    estimatedTime: quest.estimatedTime || 20,
    addressesWeakness,
    matchesInterest,
  };
}

// Generate daily goal
async function generateDailyGoal(userId, language) {
  try {
    const profile = await getLearnerProfile(userId, language);
    const dayOfWeek = new Date().getDay();
    
    let goal;
    
    // Vary goals by day of week
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Weekend - focus on vocabulary review
      goal = {
        userId,
        language,
        date: new Date().toISOString().split('T')[0],
        goalType: 'vocabulary',
        target: 20,
        completed: 0,
        description: 'Review 20 vocabulary cards',
        isComplete: false,
      };
    } else if (profile.streakDays > 0 && profile.streakDays % 7 === 0) {
      // Streak milestone - challenge with XP
      goal = {
        userId,
        language,
        date: new Date().toISOString().split('T')[0],
        goalType: 'xp',
        target: 500,
        completed: 0,
        description: 'Earn 500 XP to celebrate your streak!',
        isComplete: false,
      };
    } else if (profile.weaknessAreas.length > 0) {
      // Has weaknesses - focus on practice
      goal = {
        userId,
        language,
        date: new Date().toISOString().split('T')[0],
        goalType: 'quests',
        target: 2,
        completed: 0,
        description: `Complete 2 quests focusing on ${profile.weaknessAreas[0]}`,
        isComplete: false,
      };
    } else {
      // Default - study time
      goal = {
        userId,
        language,
        date: new Date().toISOString().split('T')[0],
        goalType: 'time',
        target: profile.averageSessionLength || 20,
        completed: 0,
        description: `Study for ${profile.averageSessionLength || 20} minutes`,
        isComplete: false,
      };
    }
    
    return goal;
  } catch (error) {
    console.error('Error generating daily goal:', error);
    throw error;
  }
}

// Helper functions
function getLevelDifficulty(level) {
  const levelMap = {
    'A1': 1,
    'A2': 3,
    'B1': 5,
    'B2': 7,
    'C1': 9,
    'C2': 10,
  };
  return levelMap[level] || 5;
}

function extractQuestTopics(quest) {
  const objectives = quest.content?.preQuest?.learningObjectives || [];
  const topics = [];
  
  objectives.forEach(obj => {
    const lower = obj.toLowerCase();
    if (lower.includes('greeting')) topics.push('greetings');
    if (lower.includes('order')) topics.push('ordering');
    if (lower.includes('direction')) topics.push('directions');
    if (lower.includes('conversation')) topics.push('conversation');
    if (lower.includes('grammar')) topics.push('grammar');
    if (lower.includes('vocabulary')) topics.push('vocabulary');
  });
  
  return [...new Set(topics)];
}

function calculateOptimalChallenge(recentScores, currentDifficulty) {
  if (recentScores.length === 0) return currentDifficulty;
  
  const averageScore = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
  
  if (averageScore > 85) {
    return Math.min(currentDifficulty + 1, 10);
  }
  
  if (averageScore < 65) {
    return Math.max(currentDifficulty - 1, 1);
  }
  
  return currentDifficulty;
}

function analyzeWeaknesses(performanceHistory) {
  const topicScores = {};
  
  performanceHistory.forEach(metric => {
    (metric.topicscovered || []).forEach(topic => {
      if (!topicScores[topic]) {
        topicScores[topic] = { scores: [], attempts: 0 };
      }
      topicScores[topic].scores.push(metric.score);
      topicScores[topic].attempts++;
    });
  });
  
  return Object.entries(topicScores)
    .filter(([_, data]) => {
      const avgScore = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
      return avgScore < 70;
    })
    .map(([topic, data]) => ({
      topic,
      averageScore: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
    }))
    .sort((a, b) => a.averageScore - b.averageScore);
}

function analyzeStrengths(performanceHistory) {
  const topicScores = {};
  
  performanceHistory.forEach(metric => {
    (metric.topicscovered || []).forEach(topic => {
      if (!topicScores[topic]) {
        topicScores[topic] = { scores: [], attempts: 0 };
      }
      topicScores[topic].scores.push(metric.score);
      topicScores[topic].attempts++;
    });
  });
  
  return Object.entries(topicScores)
    .filter(([_, data]) => {
      const avgScore = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
      return avgScore >= 85 && data.attempts >= 2;
    })
    .map(([topic, data]) => ({
      topic,
      averageScore: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
    }))
    .sort((a, b) => b.averageScore - a.averageScore);
}

// Lambda handler
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const { httpMethod, path } = event;
  const body = event.body ? JSON.parse(event.body) : {};
  const queryParams = event.queryStringParameters || {};

  try {
    // Get learner profile
    if (httpMethod === 'GET' && path === '/adaptive/profile') {
      const { userId, language } = queryParams;
      const profile = await getLearnerProfile(userId, language);
      return createResponse(200, { profile });
    }

    // Update learner profile
    if (httpMethod === 'POST' && path === '/adaptive/profile/update') {
      const { userId, language, questId, score, timeSpent } = body;
      const result = await updateLearnerProfile(userId, language, questId, score, timeSpent);
      return createResponse(200, result);
    }

    // Save performance metrics
    if (httpMethod === 'POST' && path === '/adaptive/performance') {
      const { userId, questId, metrics } = body;
      const result = await savePerformanceMetrics(userId, questId, metrics);
      return createResponse(200, result);
    }

    // Get personalized quest recommendations
    if (httpMethod === 'GET' && path === '/adaptive/recommendations') {
      const { userId, language, limit } = queryParams;
      const recommendations = await getPersonalizedQuests(userId, language, parseInt(limit) || 5);
      return createResponse(200, { recommendations });
    }

    // Get daily goal
    if (httpMethod === 'GET' && path === '/adaptive/goal/daily') {
      const { userId, language } = queryParams;
      const goal = await generateDailyGoal(userId, language);
      return createResponse(200, { goal });
    }

    // Get performance history
    if (httpMethod === 'GET' && path === '/adaptive/performance/history') {
      const { userId, language, limit } = queryParams;
      const history = await getPerformanceHistory(userId, language, parseInt(limit) || 20);
      return createResponse(200, { history });
    }

    return createResponse(404, { error: 'Not found' });
  } catch (error) {
    console.error('Error:', error);
    return createResponse(500, { error: error.message });
  }
};