#!/bin/bash

# Lambda Functions Deployment Script
# Deploys vocabulary-service and adaptive-learning-service

echo "🚀 Deploying Lambda Functions..."

# Deploy Vocabulary Service
echo "Deploying vocabulary-service..."
cd backend/lambdas/vocabulary-service

# Install dependencies
npm install

# Create deployment package
zip -r function.zip index.js package*.json node_modules/

# Update or create Lambda function
if aws lambda get-function --function-name explorespeak-vocabulary-service 2>/dev/null; then
    echo "Updating existing vocabulary-service function..."
    aws lambda update-function-code \
      --function-name explorespeak-vocabulary-service \
      --zip-file fileb://function.zip
else
    echo "Creating new vocabulary-service function..."
    aws lambda create-function \
      --function-name explorespeak-vocabulary-service \
      --runtime nodejs18.x \
      --handler index.handler \
      --role arn:aws:iam::391907191624:role/language-quest-lambda-role \
      --zip-file fileb://function.zip \
      --environment Variables="{VOCABULARY_TABLE=ExploreSpeak-VocabularyCards,REVIEW_SESSIONS_TABLE=ExploreSpeak-ReviewSessions,AWS_REGION=us-east-1}" \
      --memory-size 512 \
      --timeout 30
fi

# Update configuration
aws lambda update-function-configuration \
  --function-name explorespeak-vocabulary-service \
  --memory-size 512 \
  --timeout 30 \
  --environment Variables="{VOCABULARY_TABLE=ExploreSpeak-VocabularyCards,REVIEW_SESSIONS_TABLE=ExploreSpeak-ReviewSessions,AWS_REGION=us-east-1}"

echo "✅ Vocabulary service deployed"

# Deploy Adaptive Learning Service
echo "Deploying adaptive-learning-service..."
cd ../../adaptive-learning-service

# Install dependencies
npm install

# Create deployment package
zip -r function.zip index.js package*.json node_modules/

# Update or create Lambda function
if aws lambda get-function --function-name explorespeak-adaptive-learning-service 2>/dev/null; then
    echo "Updating existing adaptive-learning-service function..."
    aws lambda update-function-code \
      --function-name explorespeak-adaptive-learning-service \
      --zip-file fileb://function.zip
else
    echo "Creating new adaptive-learning-service function..."
    aws lambda create-function \
      --function-name explorespeak-adaptive-learning-service \
      --runtime nodejs18.x \
      --handler index.handler \
      --role arn:aws:iam::391907191624:role/language-quest-lambda-role \
      --zip-file fileb://function.zip \
      --environment Variables="{LEARNER_PROFILES_TABLE=ExploreSpeak-LearnerProfiles,PERFORMANCE_TABLE=ExploreSpeak-Performance,QUESTS_TABLE=ExploreSpeak-Quests,PROGRESS_TABLE=ExploreSpeak-Progress,AWS_REGION=us-east-1}" \
      --memory-size 512 \
      --timeout 30
fi

# Update configuration
aws lambda update-function-configuration \
  --function-name explorespeak-adaptive-learning-service \
  --memory-size 512 \
  --timeout 30 \
  --environment Variables="{LEARNER_PROFILES_TABLE=ExploreSpeak-LearnerProfiles,PERFORMANCE_TABLE=ExploreSpeak-Performance,QUESTS_TABLE=ExploreSpeak-Quests,PROGRESS_TABLE=ExploreSpeak-Progress,AWS_REGION=us-east-1}"

echo "✅ Adaptive learning service deployed"

# Cleanup
rm -f function.zip

echo "🎉 All Lambda functions deployed successfully!"
echo ""
echo "📋 Function ARNs:"
aws lambda get-function --function-name explorespeak-vocabulary-service --query 'Configuration.FunctionArn'
aws lambda get-function --function-name explorespeak-adaptive-learning-service --query 'Configuration.FunctionArn'