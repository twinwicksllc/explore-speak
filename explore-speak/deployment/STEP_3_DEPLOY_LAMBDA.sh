#!/bin/bash

# Step 3: Deploy Lambda Functions
# Copy and paste these commands in your local terminal

echo '🚀 Deploying Lambda Functions...'

# Make sure you're in the explore-speak directory
cd explore-speak

# Deploy Vocabulary Service
echo 'Deploying vocabulary-service...'
cd backend/lambdas/vocabulary-service

# Install dependencies
npm install

# Create deployment package
zip -r function.zip index.js package*.json node_modules/

# Create Lambda function
aws lambda create-function \
  --function-name explorespeak-vocabulary-service \
  --runtime nodejs18.x \
  --handler index.handler \
  --role arn:aws:iam::391907191624:role/language-quest-lambda-role \
  --zip-file fileb://function.zip \
  --environment Variables='{VOCABULARY_TABLE=ExploreSpeak-VocabularyCards,REVIEW_SESSIONS_TABLE=ExploreSpeak-ReviewSessions,AWS_REGION=us-east-1}' \
  --memory-size 512 \
  --timeout 30 \
  --region us-east-1

echo '✅ Vocabulary service deployed'

# Deploy Adaptive Learning Service
echo 'Deploying adaptive-learning-service...'
cd ../../adaptive-learning-service

# Install dependencies
npm install

# Create deployment package
zip -r function.zip index.js package*.json node_modules/

# Create Lambda function
aws lambda create-function \
  --function-name explorespeak-adaptive-learning-service \
  --runtime nodejs18.x \
  --handler index.handler \
  --role arn:aws:iam::391907191624:role/language-quest-lambda-role \
  --zip-file fileb://function.zip \
  --environment Variables='{LEARNER_PROFILES_TABLE=ExploreSpeak-LearnerProfiles,PERFORMANCE_TABLE=ExploreSpeak-Performance,QUESTS_TABLE=ExploreSpeak-Quests,PROGRESS_TABLE=ExploreSpeak-Progress,AWS_REGION=us-east-1}' \
  --memory-size 512 \
  --timeout 30 \
  --region us-east-1

echo '✅ Adaptive learning service deployed'

# Cleanup
rm -f function.zip
cd ../../..

echo '🎉 Both Lambda functions deployed successfully!'