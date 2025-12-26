# Find and Fix Lambda Files

## Step 1: Find the Actual Lambda Files
```bash
# Find all index.js files in the project
find . -name "index.js" -type f

# Or find vocabulary-service specifically
find . -name "*vocabulary*" -type d
```

## Step 2: Check Current Directory Structure
```bash
# See what's in the current directory
ls -la

# Check if there's a backend directory
ls -la backend/ 2>/dev/null || echo "No backend directory found"

# Find the actual location of vocabulary service
find . -path "*/vocabulary-service*" -type f -name "*.js"
```

## Step 3: Navigate to Correct Location
Once you find the files, navigate there and check the handler:

For example, if you find the files at `./backend/lambdas/vocabulary-service/index.js`:

```bash
cd backend/lambdas/vocabulary-service

# Check the handler exports
cat index.js | tail -10

# Verify the zip structure
ls -la
```

## Step 4: Create Correct Zip
```bash
# Make sure you're in the right directory with index.js
pwd
ls -la index.js

# Create zip with correct structure
zip vocabulary-service.zip index.js package.json

# Verify the zip contents
unzip -l vocabulary-service.zip

# Deploy
aws lambda update-function-code \
  --function-name explore-speak-vocabulary-service \
  --zip-file fileb://vocabulary-service.zip \
  --region us-east-1
```

## Step 5: Test Again
```bash
# Go back to root first
cd ../../..  # Adjust based on where you started

# Test the Lambda
aws lambda invoke \
  --function-name explore-speak-vocabulary-service \
  --cli-binary-format raw-in-base64-out \
  --payload '{"httpMethod":"GET","path":"/vocabulary/cards","queryStringParameters":{"userId":"test-user","language":"pt"}}' \
  response.json \
  --region us-east-1

cat response.json
```

The issue is likely that you're not in the right directory when creating the zip file. Let's find the correct file locations first!