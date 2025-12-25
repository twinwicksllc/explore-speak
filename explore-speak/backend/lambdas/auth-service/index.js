const { CognitoIdentityProviderClient, InitiateAuthCommand, SignUpCommand, ConfirmSignUpCommand, RespondToAuthChallengeCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const jwt = require('jsonwebtoken');

const cognito = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || 'us-east-1' });
const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' }));

const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const USERS_TABLE = process.env.USERS_TABLE || 'ExploreSpeak-Users';

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

// Sign up new user
async function signUp(email, password, name) {
  try {
    const signUpParams = {
      ClientId: CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: name },
      ],
    };

    const signUpResult = await cognito.send(new SignUpCommand(signUpParams));

    // Create user record in DynamoDB
    const userId = signUpResult.UserSub;
    await dynamodb.send(new PutCommand({
      TableName: USERS_TABLE,
      Item: {
        userId,
        email,
        name,
        createdAt: new Date().toISOString(),
        level: 1,
        xp: 0,
        streak: 0,
        preferredLanguage: null,
      },
    }));

    return createResponse(200, {
      success: true,
      message: 'User registered successfully. Please check your email for verification code.',
      userId,
    });
  } catch (error) {
    console.error('Sign up error:', error);
    return createResponse(400, {
      success: false,
      error: error.message,
    });
  }
}

// Confirm sign up with verification code
async function confirmSignUp(email, code) {
  try {
    await cognito.send(new ConfirmSignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
    }));

    return createResponse(200, {
      success: true,
      message: 'Email verified successfully. You can now sign in.',
    });
  } catch (error) {
    console.error('Confirm sign up error:', error);
    return createResponse(400, {
      success: false,
      error: error.message,
    });
  }
}

// Sign in user
async function signIn(email, password) {
  try {
    const authParams = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };

    const authResult = await cognito.send(new InitiateAuthCommand(authParams));

    if (authResult.ChallengeName) {
      return createResponse(200, {
        success: true,
        challengeName: authResult.ChallengeName,
        session: authResult.Session,
      });
    }

    const idToken = authResult.AuthenticationResult.IdToken;
    const accessToken = authResult.AuthenticationResult.AccessToken;
    const refreshToken = authResult.AuthenticationResult.RefreshToken;

    // Decode ID token to get user info
    const decoded = jwt.decode(idToken);
    const userId = decoded.sub;

    // Get user data from DynamoDB
    const userResult = await dynamodb.send(new GetCommand({
      TableName: USERS_TABLE,
      Key: { userId },
    }));

    return createResponse(200, {
      success: true,
      tokens: {
        idToken,
        accessToken,
        refreshToken,
      },
      user: userResult.Item,
    });
  } catch (error) {
    console.error('Sign in error:', error);
    return createResponse(401, {
      success: false,
      error: error.message,
    });
  }
}

// Refresh access token
async function refreshToken(refreshTokenValue) {
  try {
    const authParams = {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: refreshTokenValue,
      },
    };

    const authResult = await cognito.send(new InitiateAuthCommand(authParams));

    return createResponse(200, {
      success: true,
      tokens: {
        idToken: authResult.AuthenticationResult.IdToken,
        accessToken: authResult.AuthenticationResult.AccessToken,
      },
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return createResponse(401, {
      success: false,
      error: error.message,
    });
  }
}

// Main Lambda handler
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const path = event.path || event.rawPath || '';
  const httpMethod = event.httpMethod || event.requestContext?.http?.method || 'GET';
  
  let body = {};
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch (e) {
    return createResponse(400, { success: false, error: 'Invalid JSON body' });
  }

  try {
    // Route handling
    if (path.includes('/signup') && httpMethod === 'POST') {
      const { email, password, name } = body;
      if (!email || !password || !name) {
        return createResponse(400, { success: false, error: 'Missing required fields' });
      }
      return await signUp(email, password, name);
    }

    if (path.includes('/confirm') && httpMethod === 'POST') {
      const { email, code } = body;
      if (!email || !code) {
        return createResponse(400, { success: false, error: 'Missing required fields' });
      }
      return await confirmSignUp(email, code);
    }

    if (path.includes('/signin') && httpMethod === 'POST') {
      const { email, password } = body;
      if (!email || !password) {
        return createResponse(400, { success: false, error: 'Missing required fields' });
      }
      return await signIn(email, password);
    }

    if (path.includes('/refresh') && httpMethod === 'POST') {
      const { refreshToken: token } = body;
      if (!token) {
        return createResponse(400, { success: false, error: 'Missing refresh token' });
      }
      return await refreshToken(token);
    }

    // Health check
    if (path.includes('/health')) {
      return createResponse(200, { success: true, message: 'Auth service is healthy' });
    }

    return createResponse(404, { success: false, error: 'Route not found' });
  } catch (error) {
    console.error('Handler error:', error);
    return createResponse(500, {
      success: false,
      error: 'Internal server error',
    });
  }
};
