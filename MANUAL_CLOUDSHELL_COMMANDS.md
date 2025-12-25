# Manual CloudShell Commands

Since the deployment script isn't in the repository, here are the exact commands to run in CloudShell:

## Step 1: Update IAM Permissions
```bash
aws iam put-role-policy \
  --role-name language-quest-lambda-role \
  --policy-name LambdaDynamoDBPolicy \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [
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
      },
      {
        "Effect": "Allow",
        "Action": [
          "logs:CreateLogGroup",
          "logs:CreateLogStream", 
          "logs:PutLogEvents"
        ],
        "Resource": "arn:aws:logs:*:*:*"
      }
    ]
  }' \
  --region us-east-1
```

## Step 2: Deploy Vocabulary Service
```bash
cd backend/lambdas/vocabulary-service
zip -r vocabulary-service.zip .
aws lambda update-function-code \
  --function-name explore-speak-vocabulary-service \
  --zip-file fileb://vocabulary-service.zip \
  --region us-east-1
cd ../../..
```

## Step 3: Deploy Adaptive Learning Service
```bash
cd backend/lambdas/adaptive-learning-service
zip -r adaptive-learning-service.zip .
aws lambda update-function-code \
  --function-name explore-speak-adaptive-learning-service \
  --zip-file fileb://adaptive-learning-service.zip \
  --region us-east-1
cd ../../..
```

## Step 4: Test the Fixes

### Test Vocabulary Service
```bash
aws lambda invoke \
  --function-name explore-speak-vocabulary-service \
  --cli-binary-format raw-in-base64-out \
  --payload '{"httpMethod":"GET","path":"/vocabulary/cards","queryStringParameters":{"userId":"test-user","language":"pt"}}' \
  response.json \
  --region us-east-1

cat response.json
```

### Test Adaptive Learning Service
```bash
aws lambda invoke \
  --function-name explore-speak-adaptive-learning-service \
  --cli-binary-format raw-in-base64-out \
  --payload '{"httpMethod":"GET","path":"/adaptive/profile/test-user/english"}' \
  response.json \
  --region us-east-1

cat response.json
```

## Expected Results

After deployment, both should return:
```json
{"statusCode":200,"headers":{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"},"body":"{&quot;success&quot;:true,...}"}
```

Instead of the previous errors:
- ❌ "Invalid KeyConditionExpression: Attribute name is a reserved keyword; reserved keyword: language"
- ❌ "not authorized to perform: dynamodb:GetItem"

Run these commands one by one in your CloudShell!