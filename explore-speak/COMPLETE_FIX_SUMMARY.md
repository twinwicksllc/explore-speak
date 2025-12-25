# ExploreSpeak Lambda Functions - Complete Fix Summary

## Issues Identified

### 1. Reserved Keyword Error in Both Services
**Error Message:**
```
Invalid KeyConditionExpression: Attribute name is a reserved keyword; reserved keyword: language
```

**Root Cause:** DynamoDB reserves `language` as a keyword and requires ExpressionAttributeNames when used in queries.

**Services Affected:**
- ✓ Vocabulary Service (explore-speak-vocabulary-service)
- ✓ Adaptive Learning Service (explore-speak-adaptive-learning-service)

### 2. Missing IAM Permissions
**Error Message:**
```
User: arn:aws:sts::391907191624:assumed-role/language-quest-lambda-role/explore-speak-adaptive-learning-service 
is not authorized to perform: dynamodb:GetItem on resource: arn:aws:dynamodb:us-east-1:391907191624:table/ExploreSpeak-LearnerProfiles
```

**Root Cause:** Lambda execution role lacks permissions for new DynamoDB tables.

## Fixes Applied

### Vocabulary Service (`explore-speak/backend/lambdas/vocabulary-service/index.js`)

#### Fix 1: getVocabularyCards Function (Line 64)
```javascript
// BEFORE
FilterExpression: 'language = :language',
ExpressionAttributeValues: {
  ':userId': userId,
  ':now': now,
  ':language': language,
}

// AFTER
FilterExpression: '#lang = :language',
ExpressionAttributeNames: {
  '#lang': 'language'
},
ExpressionAttributeValues: {
  ':userId': userId,
  ':now': now,
  ':language': language,
}
```

#### Fix 2: getVocabularyStats Function (Line 208)
```javascript
// BEFORE
KeyConditionExpression: 'userId = :userId AND language = :language',
ExpressionAttributeValues: {
  ':userId': userId,
  ':language': language,
}

// AFTER
KeyConditionExpression: 'userId = :userId AND #lang = :language',
ExpressionAttributeNames: {
  '#lang': 'language'
},
ExpressionAttributeValues: {
  ':userId': userId,
  ':language': language,
}
```

### Adaptive Learning Service (`explore-speak/backend/lambdas/adaptive-learning-service/index.js`)

#### Fix: getPersonalizedQuests Function (Line 189)
```javascript
// BEFORE
FilterExpression: 'language = :language',
ExpressionAttributeValues: {
  ':language': language,
}

// AFTER
FilterExpression: '#lang = :language',
ExpressionAttributeNames: {
  '#lang': 'language'
},
ExpressionAttributeValues: {
  ':language': language,
}
```

### IAM Policy Update (`iam-policy-update.json`)

Added comprehensive DynamoDB permissions for all ExploreSpeak tables:
```json
{
  "Effect": "Allow",
  "Action": [
    "dynamodb:GetItem",
    "dynamodb:PutItem",
    "dynamodb:UpdateItem",
    "dynamodb:DeleteItem",
    "dynamodb:Query",
    "dynamodb:Scan",
    "dynamodb:BatchGetItem",
    "dynamodb:BatchWriteItem"
  ],
  "Resource": [
    "arn:aws:dynamodb:us-east-1:391907191624:table/ExploreSpeak-*",
    "arn:aws:dynamodb:us-east-1:391907191624:table/ExploreSpeak-*/index/*"
  ]
}
```

## Deployment Instructions

### Option 1: Automated Deployment (Recommended)
Run the all-in-one deployment script:
```bash
./deploy-all-fixes.sh
```

This script will:
1. Update IAM role permissions
2. Package vocabulary service
3. Deploy vocabulary service
4. Package adaptive learning service
5. Deploy adaptive learning service

### Option 2: Manual Deployment

#### Step 1: Update IAM Permissions
```bash
aws iam put-role-policy \
  --role-name language-quest-lambda-role \
  --policy-name LambdaDynamoDBPolicy \
  --policy-document file://iam-policy-update.json \
  --region us-east-1
```

#### Step 2: Deploy Vocabulary Service
```bash
cd explore-speak
zip -r vocabulary-service.zip backend/lambdas/vocabulary-service/
aws lambda update-function-code \
  --function-name explore-speak-vocabulary-service \
  --zip-file fileb://vocabulary-service.zip \
  --region us-east-1
```

#### Step 3: Deploy Adaptive Learning Service
```bash
zip -r adaptive-learning-service.zip backend/lambdas/adaptive-learning-service/
aws lambda update-function-code \
  --function-name explore-speak-adaptive-learning-service \
  --zip-file fileb://adaptive-learning-service.zip \
  --region us-east-1
cd ..
```

## Verification Tests

After deployment, test both services:

### Test Vocabulary Service
```bash
aws lambda invoke \
  --function-name explore-speak-vocabulary-service \
  --cli-binary-format raw-in-base64-out \
  --payload '{"httpMethod":"GET","path":"/vocabulary/cards","queryStringParameters":{"userId":"test-user","language":"pt"}}' \
  response.json \
  && cat response.json
```

**Expected Result:** Status 200 with vocabulary cards data (or empty array if no cards exist)

### Test Adaptive Learning Service
```bash
aws lambda invoke \
  --function-name explore-speak-adaptive-learning-service \
  --cli-binary-format raw-in-base64-out \
  --payload '{"httpMethod":"GET","path":"/adaptive/profile/test-user/english"}' \
  response.json \
  && cat response.json
```

**Expected Result:** Status 200 with learner profile data

## Files Modified

1. `explore-speak/backend/lambdas/vocabulary-service/index.js` - Fixed reserved keyword usage
2. `explore-speak/backend/lambdas/adaptive-learning-service/index.js` - Fixed reserved keyword usage
3. `iam-policy-update.json` - New comprehensive IAM policy
4. `deploy-all-fixes.sh` - Automated deployment script

## Common DynamoDB Reserved Keywords

To avoid similar issues in the future, be aware of these common reserved keywords:
- `language`
- `name`
- `date`
- `time`
- `status`
- `type`
- `data`
- `value`
- `key`
- `index`

Always use ExpressionAttributeNames when working with these attributes.

## Success Criteria

✓ Vocabulary service returns 200 status code
✓ Adaptive learning service returns 200 status code
✓ No "reserved keyword" errors
✓ No "not authorized" errors
✓ Both services can read/write to DynamoDB tables

## Next Steps

After successful deployment:
1. Test SRS functionality through the frontend
2. Verify adaptive learning recommendations
3. Monitor CloudWatch logs for any remaining issues
4. Test with real user data