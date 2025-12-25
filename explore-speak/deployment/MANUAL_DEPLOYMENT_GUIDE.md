# Manual Deployment Guide - Run These Commands Locally

## 🎯 Step-by-Step Instructions

Since AWS CLI isn't available in this environment, you'll need to run these commands on your local machine where AWS CLI is installed and configured.

---

## 📋 Step 1: Install/Configure AWS CLI (If not done)

```bash
# Install AWS CLI (if not already installed)
# Mac:
brew install awscli

# Windows:
# Download from: https://aws.amazon.com/cli/

# Configure AWS CLI (if not configured)
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key  
# Enter default region: us-east-1
# Enter default output format: json
```

---

## 📋 Step 2: Create DynamoDB Tables

Run these commands in your terminal:

```bash
# 1. Create Vocabulary Cards table
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

# 2. Create Review Sessions table
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

# 3. Create Learner Profiles table
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

# 4. Create Performance Metrics table
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
```

---

## 📋 Step 3: Deploy Lambda Functions

```bash
# Navigate to vocabulary service
cd explore-speak/backend/lambdas/vocabulary-service

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
  --environment Variables="{VOCABULARY_TABLE=ExploreSpeak-VocabularyCards,REVIEW_SESSIONS_TABLE=ExploreSpeak-ReviewSessions,AWS_REGION=us-east-1}" \
  --memory-size 512 \
  --timeout 30 \
  --region us-east-1

echo "✅ Vocabulary service deployed"

# Navigate to adaptive learning service
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
  --environment Variables="{LEARNER_PROFILES_TABLE=ExploreSpeak-LearnerProfiles,PERFORMANCE_TABLE=ExploreSpeak-Performance,QUESTS_TABLE=ExploreSpeak-Quests,PROGRESS_TABLE=ExploreSpeak-Progress,AWS_REGION=us-east-1}" \
  --memory-size 512 \
  --timeout 30 \
  --region us-east-1

echo "✅ Adaptive learning service deployed"

# Cleanup
cd ../../..
rm -f backend/lambdas/*/function.zip
```

---

## 📋 Step 4: Setup API Gateway

```bash
# API ID (your existing API)
API_ID="97w79t3en3"
REGION="us-east-1"

# Get root resource ID
ROOT_RESOURCE=$(aws apigateway get-resources --rest-api-id $API_ID --query 'items[?path==`/`].id' --output text)
echo "Root resource ID: $ROOT_RESOURCE"

# Create vocabulary resource
VOCAB_RESOURCE=$(aws apigateway create-resource \
  --rest-api-id $API_ID \
  --parent-id $ROOT_RESOURCE \
  --path-part vocabulary \
  --query 'id' --output text)

# Create adaptive resource
ADAPTIVE_RESOURCE=$(aws apigateway create-resource \
  --rest-api-id $API_ID \
  --parent-id $ROOT_RESOURCE \
  --path-part adaptive \
  --query 'id' --output text)

echo "Resource IDs: Vocabulary=$VOCAB_RESOURCE, Adaptive=$ADAPTIVE_RESOURCE"

# Grant API Gateway permission to invoke Lambda functions
aws lambda add-permission \
  --function-name explorespeak-vocabulary-service \
  --statement-id apigateway-invoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:$REGION:391907191624:$API_ID/*/POST/vocabulary/*"

aws lambda add-permission \
  --function-name explorespeak-adaptive-learning-service \
  --statement-id apigateway-invoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:$REGION:391907191624:$API_ID/*/POST/adaptive/*"

# Create vocabulary endpoints (simplified)
aws apigateway put-method \
  --rest-api-id $API_ID \
  --resource-id $VOCAB_RESOURCE \
  --http-method GET \
  --authorization-type NONE

aws apigateway put-integration \
  --rest-api-id $API_ID \
  --resource-id $VOCAB_RESOURCE \
  --http-method GET \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:391907191624:function:explorespeak-vocabulary-service/invocations

# Create adaptive endpoints (simplified)
aws apigateway put-method \
  --rest-api-id $API_ID \
  --resource-id $ADAPTIVE_RESOURCE \
  --http-method GET \
  --authorization-type NONE

aws apigateway put-integration \
  --rest-api-id $API_ID \
  --resource-id $ADAPTIVE_RESOURCE \
  --http-method GET \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:391907191624:function:explorespeak-adaptive-learning-service/invocations

# Deploy API
aws apigateway create-deployment \
  --rest-api-id $API_ID \
  --stage-name prod

echo "✅ API Gateway setup complete!"
```

---

## 📋 Step 5: Update Frontend

```bash
# Navigate to frontend directory
cd explore-speak/frontend

# Install dependencies
npm install

# Update App.tsx (the script already created the new version)
# Just copy the generated content or run the integration script
cd ..
./deployment/frontend-integration.sh

# Build frontend
cd frontend
npm run build

# Deploy to S3
aws s3 sync dist/ s3://explorespeak.com --delete

# Clear CloudFront cache
aws cloudfront create-invalidation --distribution-id E3EXV0XICCR1ZH --paths "/*"

echo "✅ Frontend deployed!"
```

---

## 📋 Step 6: Test Everything

```bash
# Test vocabulary endpoint
curl "https://97w79t3en3.execute-api.us-east-1.amazonaws.com/prod/vocabulary/stats?userId=test&language=French"

# Test adaptive endpoint
curl "https://97w79t3en3.execute-api.us-east-1.amazonaws.com/prod/adaptive/profile?userId=test&language=French"

# Visit https://explorespeak.com and test:
# 1. Login and complete a quest
# 2. Check dashboard for recommendations
# 3. Click "Review Vocabulary"
```

---

## 🔍 Troubleshooting Commands

```bash
# Check DynamoDB tables
aws dynamodb list-tables --query "TableNames[?contains(@, 'ExploreSpeak')]"

# Check Lambda functions
aws lambda list-functions --query "Functions[?contains(FunctionName, 'explorespeak')]"

# Check Lambda logs
aws logs tail /aws/lambda/explorespeak-vocabulary-service --follow
aws logs tail /aws/lambda/explorespeak-adaptive-learning-service --follow

# Check API Gateway
aws apigateway get-deployments --rest-api-id 97w79t3en3
```

---

## ⏱️ Expected Timeline

- **Step 1 (AWS CLI setup)**: 5-10 minutes
- **Step 2 (DynamoDB)**: 5-8 minutes (includes waiting)
- **Step 3 (Lambda)**: 5-10 minutes
- **Step 4 (API Gateway)**: 8-12 minutes
- **Step 5 (Frontend)**: 3-5 minutes
- **Step 6 (Testing)**: 5-10 minutes

**Total: 30-60 minutes**

---

## 🎯 Success Checklist

When you're done, verify:

✅ All 4 DynamoDB tables exist and are "ACTIVE"
✅ Both Lambda functions deployed without errors
✅ API Gateway has new /vocabulary and /adaptive resources
✅ Frontend loads at https://explorespeak.com
✅ New features work (vocabulary review, recommendations)

---

## 📞 If You Get Stuck

1. **Check CloudWatch logs** for any Lambda errors
2. **Verify IAM role** has the right permissions
3. **Test API endpoints** individually with curl
4. **Check API Gateway logs** for integration errors

Run the commands in this file step by step, and let me know if you encounter any issues!