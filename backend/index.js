const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

// Initialize AWS clients
const dynamoClient = new DynamoDBClient({});
const dynamoDoc = DynamoDBDocumentClient.from(dynamoClient);
const bedrockClient = new BedrockRuntimeClient({});

// Sofia's personality prompt
const SOFIA_PERSONALITY = `You are Sofia Oliveira, a 28-year-old Brazilian travel advisor and Portuguese teacher from Rio de Janeiro. 

Your personality:
- Warm, enthusiastic, and knowledgeable about Brazilian culture
- Passionate about sharing authentic Brazilian experiences
- Fluent in both Portuguese and English
- Loves helping travelers discover hidden gems in Brazil
- Always incorporates Portuguese phrases and cultural context

Your role:
1. Help users plan authentic trips to Brazil
2. Teach Portuguese phrases relevant to their travel plans
3. Provide cultural insights and tips
4. Make recommendations based on user preferences
5. Keep conversations engaging and educational

Guidelines:
- Always be friendly and encouraging
- Include Portuguese phrases with translations
- Give specific, actionable travel advice
- Ask questions to understand user preferences
- Keep responses concise but informative
- Be authentic to Brazilian culture`;

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
    };
    
    try {
        // Handle preflight requests
        if (event.httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers,
                body: ''
            };
        }
        
        // Parse request body
        const body = JSON.parse(event.body || '{}');
        const { message, userId, conversationId } = body;
        
        if (!message || !userId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Message and userId are required' })
            };
        }
        
        // Generate conversation ID if not provided
        const convId = conversationId || `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Try to get existing conversation
        let conversationHistory = [];
        try {
            const getParams = {
                TableName: 'travel-conversations',
                Key: {
                    conversationId: convId
                }
            };
            
            const result = await dynamoDoc.send(new GetCommand(getParams));
            if (result.Item) {
                conversationHistory = result.Item.messages || [];
            }
        } catch (error) {
            console.log('No existing conversation found, creating new one');
        }
        
        // Add user message to history
        conversationHistory.push({
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        });
        
        // Prepare context for AI (last 10 messages to stay within token limits)
        const contextMessages = conversationHistory.slice(-10);
        
        // Create prompt for Sofia
        const prompt = `${SOFIA_PERSONALITY}

Conversation history:
${contextMessages.map(msg => `${msg.role}: ${msg.content}`).join('\\n')}

Current user message: ${message}

Please respond as Sofia, keeping your response friendly, informative, and incorporating Portuguese phrases where appropriate. Keep your response concise (under 200 words).`;
        
        // Call Bedrock for AI response - USING CLAUDE 3 SONNET (WORKING MODEL)
        const bedrockParams = {
            modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 300,
                temperature: 0.7,
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            })
        };
        
        const bedrockResponse = await bedrockClient.send(new InvokeModelCommand(bedrockParams));
        const responseBody = JSON.parse(new TextDecoder().decode(bedrockResponse.body));
        const aiResponse = responseBody.content[0].text;
        
        // Add AI response to history
        conversationHistory.push({
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date().toISOString()
        });
        
        // Save conversation to DynamoDB
        const putParams = {
            TableName: 'travel-conversations',
            Item: {
                conversationId: convId,
                userId: userId,
                messages: conversationHistory,
                lastUpdated: new Date().toISOString()
            }
        };
        
        await dynamoDoc.send(new PutCommand(putParams));
        
        // Return successful response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: aiResponse,
                conversationId: convId,
                userId: userId,
                timestamp: new Date().toISOString()
            })
        };
        
    } catch (error) {
        console.error('Error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error.message 
            })
        };
    }
};