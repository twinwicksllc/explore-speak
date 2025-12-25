#!/bin/bash

# API Gateway Setup Script
# Adds new endpoints for SRS and Adaptive Learning

API_ID="97w79t3en3"  # Your existing API ID
REGION="us-east-1"

echo "🚀 Setting up API Gateway endpoints..."

# Get root resource ID
ROOT_RESOURCE=$(aws apigateway get-resources --rest-api-id $API_ID --query 'items[?path==`/`].id' --output text)
echo "Root resource ID: $ROOT_RESOURCE"

# Create vocabulary resource
echo "Creating /vocabulary resource..."
VOCAB_RESOURCE=$(aws apigateway create-resource \
  --rest-api-id $API_ID \
  --parent-id $ROOT_RESOURCE \
  --path-part vocabulary \
  --query 'id' --output text)
echo "Vocabulary resource ID: $VOCAB_RESOURCE"

# Create adaptive resource
echo "Creating /adaptive resource..."
ADAPTIVE_RESOURCE=$(aws apigateway create-resource \
  --rest-api-id $API_ID \
  --parent-id $ROOT_RESOURCE \
  --path-part adaptive \
  --query 'id' --output text)
echo "Adaptive resource ID: $ADAPTIVE_RESOURCE"

# Vocabulary Service Endpoints

# GET /vocabulary/due
echo "Creating GET /vocabulary/due endpoint..."
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
  --uri arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:391907191624:function:explorespeak-vocabulary-service/invocations \
  --request-parameters 'integration.request.querystring.userId=method.request.querystring.userId,integration.request.querystring.language=method.request.querystring.language'

aws apigateway put-method-response \
  --rest-api-id $API_ID \
  --resource-id $VOCAB_RESOURCE \
  --http-method GET \
  --status-code 200

aws apigateway put-integration-response \
  --rest-api-id $API_ID \
  --resource-id $VOCAB_RESOURCE \
  --http-method GET \
  --status-code 200 \
  --response-templates '{"application/json":""}'

# POST /vocabulary/update
echo "Creating POST /vocabulary/update endpoint..."
aws apigateway put-method \
  --rest-api-id $API_ID \
  --resource-id $VOCAB_RESOURCE \
  --http-method POST \
  --authorization-type NONE \
  --request-parameters 'method.request.header.Content-Type=false'

aws apigateway put-integration \
  --rest-api-id $API_ID \
  --resource-id $VOCAB_RESOURCE \
  --http-method POST \
  --type AWS_PROXY \
  --integration-http-method POST \
  --uri arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:391907191624:function:explorespeak-vocabulary-service/invocations

aws apigateway put-method-response \
  --rest-api-id $API_ID \
  --resource-id $VOCAB_RESOURCE \
  --http-method POST \
  --status-code 200

aws apigateway put-integration-response \
  --rest-api-id $API_ID \
  --resource-id $VOCAB_RESOURCE \
  --http-method POST \
  --status-code 200 \
  --response-templates '{"application/json":""}'

# Adaptive Learning Service Endpoints

# GET /adaptive/profile
echo "Creating GET /adaptive/profile endpoint..."
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

aws apigateway put-method-response \
  --rest-api-id $API_ID \
  --resource-id $ADAPTIVE_RESOURCE \
  --http-method GET \
  --status-code 200

aws apigateway put-integration-response \
  --rest-api-id $API_ID \
  --resource-id $ADAPTIVE_RESOURCE \
  --http-method GET \
  --status-code 200 \
  --response-templates '{"application/json":""}'

# Deploy API
echo "Deploying API to production stage..."
aws apigateway create-deployment \
  --rest-api-id $API_ID \
  --stage-name prod

echo "✅ API Gateway setup complete!"
echo ""
echo "🌐 Your new endpoints are available at:"
echo "https://$API_ID.execute-api.$REGION.amazonaws.com/prod/vocabulary/*"
echo "https://$API_ID.execute-api.$REGION.amazonaws.com/prod/adaptive/*"