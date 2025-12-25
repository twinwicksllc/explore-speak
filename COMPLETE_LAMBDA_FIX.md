# Complete Lambda Fix - Handler Configuration

## Diagnosis
The Lambda is still getting "Cannot find module 'index'" which means either:
1. The zip structure is still wrong, OR
2. The Lambda handler configuration doesn't match

## Step 1: Check Lambda Handler Configuration
```bash
aws lambda get-function-configuration \
  --function-name explore-speak-vocabulary-service \
  --region us-east-1
```

Look for the `Handler` field - it should be `index.handler` or `index` depending on your exports.

## Step 2: Check Your Lambda Handler Exports

First, let's see what's actually exported in your index.js:

```bash
cat backend/lambdas/vocabulary-service/index.js | tail -10
```

Look for exports like:
- `exports.handler = ...` (Handler should be `index.handler`)
- `module.exports.handler = ...` (Handler should be `index.handler`)
- `module.exports = ...` (Handler should be `index`)

## Step 3: Fix Handler Configuration

If your exports use `exports.handler`, update the handler:
```bash
aws lambda update-function-configuration \
  --function-name explore-speak-vocabulary-service \
  --handler index.handler \
  --region us-east-1
```

If your exports use `module.exports = { handler: ... }`, update to:
```bash
aws lambda update-function-configuration \
  --function-name explore-speak-vocabulary-service \
  --handler index \
  --region us-east-1
```

## Step 4: Create Perfect Zip Structure
```bash
cd backend/lambdas/vocabulary-service

# Clean up
rm -f vocabulary-service.zip

# Create zip with ONLY the files Lambda needs
zip vocabulary-service.zip index.js package.json

# Verify structure - should show:
#   index.js
#   package.json
unzip -l vocabulary-service.zip

# Deploy
aws lambda update-function-code \
  --function-name explore-speak-vocabulary-service \
  --zip-file fileb://vocabulary-service.zip \
  --region us-east-1

cd ../../..
```

## Step 5: Test with CloudWatch Logs
```bash
# Check CloudWatch logs for detailed error
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/explore-speak-vocabulary-service"

# Get the latest log stream
LOG_STREAM_NAME=$(aws logs describe-log-streams \
  --log-group-name "/aws/lambda/explore-speak-vocabulary-service" \
  --order-by LastEventTime \
  --descending \
  --limit 1 \
  --query 'logStreams[0].logStreamName' \
  --output text \
  --region us-east-1)

# View recent logs
aws logs get-log-events \
  --log-group-name "/aws/lambda/explore-speak-vocabulary-service" \
  --log-stream-name "$LOG_STREAM_NAME" \
  --limit 10 \
  --region us-east-1
```

## Alternative: Use Node Modules Structure

If the above doesn't work, try including node_modules:

```bash
cd backend/lambdas/vocabulary-service

# Install dependencies
npm install

# Create zip with everything
zip -r vocabulary-service.zip .

# Deploy
aws lambda update-function-code \
  --function-name explore-speak-vocabulary-service \
  --zip-file fileb://vocabulary-service.zip \
  --region us-east-1

cd ../../..
```

## Test Final Result
```bash
aws lambda invoke \
  --function-name explore-speak-vocabulary-service \
  --cli-binary-format raw-in-base64-out \
  --payload '{"httpMethod":"GET","path":"/vocabulary/cards","queryStringParameters":{"userId":"test-user","language":"pt"}}' \
  response.json \
  --region us-east-1

cat response.json
```

Expected: Status 200 with vocabulary data, not a module error.