# Lambda Deployment Fix - Module Not Found Error

## Problem
The Lambda function is getting "Cannot find module 'index'" because the zip file structure is wrong.

## Quick Fix Commands

### Fix Vocabulary Service
```bash
# Navigate to the vocabulary service directory
cd backend/lambdas/vocabulary-service

# Create the zip with index.js at the root level
zip -r vocabulary-service.zip index.js package.json

# Deploy to Lambda
aws lambda update-function-code \
  --function-name explore-speak-vocabulary-service \
  --zip-file fileb://vocabulary-service.zip \
  --region us-east-1

# Go back to root
cd ../../..
```

### Fix Adaptive Learning Service
```bash
# Navigate to the adaptive learning service directory
cd backend/lambdas/adaptive-learning-service

# Create the zip with index.js at the root level
zip -r adaptive-learning-service.zip index.js package.json

# Deploy to Lambda
aws lambda update-function-code \
  --function-name explore-speak-adaptive-learning-service \
  --zip-file fileb://adaptive-learning-service.zip \
  --region us-east-1

# Go back to root
cd ../../..
```

## Test After Fix
```bash
# Test vocabulary service
aws lambda invoke \
  --function-name explore-speak-vocabulary-service \
  --cli-binary-format raw-in-base64-out \
  --payload '{"httpMethod":"GET","path":"/vocabulary/cards","queryStringParameters":{"userId":"test-user","language":"pt"}}' \
  response.json \
  --region us-east-1

cat response.json

# Test adaptive learning service
aws lambda invoke \
  --function-name explore-speak-adaptive-learning-service \
  --cli-binary-format raw-in-base64-out \
  --payload '{"httpMethod":"GET","path":"/adaptive/profile/test-user/english"}' \
  response.json \
  --region us-east-1

cat response.json
```

## What Was Wrong
When you run `zip -r vocabulary-service.zip .` inside the service directory, it creates:
```
vocabulary-service.zip
├── backend/
│   └── lambdas/
│       └── vocabulary-service/
│           ├── index.js
│           └── package.json
```

But Lambda expects:
```
vocabulary-service.zip
├── index.js
├── package.json
```

The corrected commands ensure index.js is at the root level of the zip file.