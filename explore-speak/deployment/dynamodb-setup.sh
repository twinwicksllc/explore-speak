#!/bin/bash

# DynamoDB Tables Setup Script for ExploreSpeak
# Run this script to create all required tables for SRS and Adaptive Learning

echo "🚀 Creating DynamoDB Tables for ExploreSpeak..."

# Table 1: Vocabulary Cards
echo "Creating ExploreSpeak-VocabularyCards table..."
aws dynamodb create-table \
  --table-name ExploreSpeak-VocabularyCards \
  --attribute-definitions \
    AttributeName=cardId,AttributeType=S \
    AttributeName=userId,AttributeType=S \
    AttributeName=nextReviewDate,AttributeType=S \
    AttributeName=language,AttributeType=S \
  --key-schema \
    AttributeName=cardId,KeyType=HASH \
    AttributeName=userId,KeyType=RANGE \
  --global-secondary-indexes \
    '[{
        "IndexName": "userId-nextReviewDate-index",
        "KeySchema": [
            {"AttributeName":"userId","KeyType":"HASH"},
            {"AttributeName":"nextReviewDate","KeyType":"RANGE"}
        ],
        "Projection":{"ProjectionType":"ALL"},
        "ProvisionedThroughput":{"ReadCapacityUnits":5,"WriteCapacityUnits":5}
    },
    {
        "IndexName": "userId-language-index",
        "KeySchema": [
            {"AttributeName":"userId","KeyType":"HASH"},
            {"AttributeName":"language","KeyType":"RANGE"}
        ],
        "Projection":{"ProjectionType":"ALL"},
        "ProvisionedThroughput":{"ReadCapacityUnits":5,"WriteCapacityUnits":5}
    }]' \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-east-1

echo "✅ Vocabulary Cards table created"

# Table 2: Review Sessions
echo "Creating ExploreSpeak-ReviewSessions table..."
aws dynamodb create-table \
  --table-name ExploreSpeak-ReviewSessions \
  --attribute-definitions \
    AttributeName=sessionId,AttributeType=S \
    AttributeName=userId,AttributeType=S \
  --key-schema \
    AttributeName=sessionId,KeyType=HASH \
    AttributeName=userId,KeyType=RANGE \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-east-1

echo "✅ Review Sessions table created"

# Table 3: Learner Profiles
echo "Creating ExploreSpeak-LearnerProfiles table..."
aws dynamodb create-table \
  --table-name ExploreSpeak-LearnerProfiles \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=language,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
    AttributeName=language,KeyType=RANGE \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-east-1

echo "✅ Learner Profiles table created"

# Table 4: Performance Metrics
echo "Creating ExploreSpeak-Performance table..."
aws dynamodb create-table \
  --table-name ExploreSpeak-Performance \
  --attribute-definitions \
    AttributeName=performanceId,AttributeType=S \
    AttributeName=userId,AttributeType=S \
    AttributeName=completedAt,AttributeType=S \
  --key-schema \
    AttributeName=performanceId,KeyType=HASH \
  --global-secondary-indexes \
    '[{
        "IndexName": "userId-completedAt-index",
        "KeySchema": [
            {"AttributeName":"userId","KeyType":"HASH"},
            {"AttributeName":"completedAt","KeyType":"RANGE"}
        ],
        "Projection":{"ProjectionType":"ALL"},
        "ProvisionedThroughput":{"ReadCapacityUnits":5,"WriteCapacityUnits":5}
    }]' \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --region us-east-1

echo "✅ Performance Metrics table created"

echo "🎉 All DynamoDB tables created successfully!"
echo ""
echo "⏳ Waiting for tables to become active..."
aws dynamodb wait table-exists --table-name ExploreSpeak-VocabularyCards
aws dynamodb wait table-exists --table-name ExploreSpeak-ReviewSessions  
aws dynamodb wait table-exists --table-name ExploreSpeak-LearnerProfiles
aws dynamodb wait table-exists --table-name ExploreSpeak-Performance

echo "✅ All tables are now active and ready to use!"