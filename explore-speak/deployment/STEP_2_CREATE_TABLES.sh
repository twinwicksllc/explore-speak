#!/bin/bash

# Step 2: Create DynamoDB Tables
# Copy and paste these commands in your local terminal

echo "🚀 Creating DynamoDB Tables..."

# 1. Vocabulary Cards
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

# 2. Review Sessions
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

# 3. Learner Profiles
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

# 4. Performance Metrics
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

# Wait for tables to be active
echo "⏳ Waiting for tables to become active..."
aws dynamodb wait table-exists --table-name ExploreSpeak-VocabularyCards --region us-east-1
aws dynamodb wait table-exists --table-name ExploreSpeak-ReviewSessions --region us-east-1
aws dynamodb wait table-exists --table-name ExploreSpeak-LearnerProfiles --region us-east-1
aws dynamodb wait table-exists --table-name ExploreSpeak-Performance --region us-east-1

echo "✅ All tables are now active!"