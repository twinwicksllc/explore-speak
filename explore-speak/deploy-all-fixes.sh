#!/bin/bash

echo "=========================================="
echo "ExploreSpeak Lambda Functions Fix & Deploy"
echo "=========================================="
echo ""

# Set region
REGION="us-east-1"
ROLE_NAME="language-quest-lambda-role"
POLICY_NAME="LambdaDynamoDBPolicy"

echo "Step 1: Updating IAM Role Permissions..."
echo "----------------------------------------"
aws iam put-role-policy \
  --role-name $ROLE_NAME \
  --policy-name $POLICY_NAME \
  --policy-document file://iam-policy-update.json \
  --region $REGION

if [ $? -eq 0 ]; then
    echo "✓ IAM policy updated successfully"
else
    echo "✗ Failed to update IAM policy"
    exit 1
fi

echo ""
echo "Step 2: Packaging Vocabulary Service..."
echo "----------------------------------------"
cd explore-speak
zip -r vocabulary-service.zip backend/lambdas/vocabulary-service/
if [ $? -eq 0 ]; then
    echo "✓ Vocabulary service packaged"
else
    echo "✗ Failed to package vocabulary service"
    exit 1
fi

echo ""
echo "Step 3: Deploying Vocabulary Service..."
echo "----------------------------------------"
aws lambda update-function-code \
  --function-name explore-speak-vocabulary-service \
  --zip-file fileb://vocabulary-service.zip \
  --region $REGION

if [ $? -eq 0 ]; then
    echo "✓ Vocabulary service deployed"
else
    echo "✗ Failed to deploy vocabulary service"
    exit 1
fi

echo ""
echo "Step 4: Packaging Adaptive Learning Service..."
echo "-----------------------------------------------"
zip -r adaptive-learning-service.zip backend/lambdas/adaptive-learning-service/
if [ $? -eq 0 ]; then
    echo "✓ Adaptive learning service packaged"
else
    echo "✗ Failed to package adaptive learning service"
    exit 1
fi

echo ""
echo "Step 5: Deploying Adaptive Learning Service..."
echo "-----------------------------------------------"
aws lambda update-function-code \
  --function-name explore-speak-adaptive-learning-service \
  --zip-file fileb://adaptive-learning-service.zip \
  --region $REGION

if [ $? -eq 0 ]; then
    echo "✓ Adaptive learning service deployed"
else
    echo "✗ Failed to deploy adaptive learning service"
    exit 1
fi

cd ..

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Fixed Issues:"
echo "1. ✓ Reserved keyword 'language' in DynamoDB queries"
echo "2. ✓ IAM permissions for DynamoDB access"
echo ""
echo "Next Steps:"
echo "- Test vocabulary service: GET /vocabulary/cards?userId=test-user&language=pt"
echo "- Test adaptive learning: GET /adaptive/profile/test-user/english"
echo ""