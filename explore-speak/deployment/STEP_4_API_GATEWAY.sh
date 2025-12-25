#!/bin/bash

# Step 4: Setup API Gateway
# Copy and paste these commands in your local terminal

echo "🚀 Setting up API Gateway..."

# API Configuration
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
echo "Granting Lambda permissions..."
aws lambda add-permission \
  --function-name explorespeak-vocabulary-service \
  --statement-id apigateway-invoke-vocab \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:$REGION:391907191624:$API_ID/*/POST/vocabulary/*"

aws lambda add-permission \
  --function-name explorespeak-adaptive-learning-service \
  --statement-id apigateway-invoke-adaptive \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:$REGION:391907191624:$API_ID/*/POST/adaptive/*"

# Create vocabulary endpoints
echo "Creating vocabulary endpoints..."

# GET /vocabulary/due
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

# Create adaptive endpoints
echo "Creating adaptive endpoints..."

# GET /adaptive/profile
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
echo "Deploying API to production..."
aws apigateway create-deployment \
  --rest-api-id $API_ID \
  --stage-name prod

echo "✅ API Gateway setup complete!"
echo ""
echo "🌐 Your new endpoints are live at:"
echo "https://$API_ID.execute-api.$REGION.amazonaws.com/prod/vocabulary/*"
echo "https://$API_ID.execute-api.$REGION.amazonaws.com/prod/adaptive/*"