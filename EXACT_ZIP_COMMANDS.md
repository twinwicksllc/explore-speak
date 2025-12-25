# Exact Zip Commands to Fix Module Error

## The Problem
Lambda needs `index.js` at the ROOT level of the zip file, not in a subdirectory.

## Exact Commands to Run

### 1. Check Current Zip Structure (Debug)
```bash
cd backend/lambdas/vocabulary-service
unzip -l vocabulary-service.zip
```
You'll likely see nested directories like `backend/lambdas/vocabulary-service/index.js`

### 2. Create Correct Zip Structure
```bash
# Remove old zip
rm -f vocabulary-service.zip

# Create zip with index.js at root level
zip vocabulary-service.zip index.js package.json

# Verify the structure
unzip -l vocabulary-service.zip
```
You should see:
```
Archive:  vocabulary-service.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
    11669  12-25-2025 01:29   index.js
      337  12-25-2025 01:29   package.json
---------                     -------
    12006                     2 files
```

### 3. Deploy with Correct Structure
```bash
aws lambda update-function-code \
  --function-name explore-speak-vocabulary-service \
  --zip-file fileb://vocabulary-service.zip \
  --region us-east-1
```

### 4. Repeat for Adaptive Learning Service
```bash
cd ../../backend/lambdas/adaptive-learning-service

# Remove old zip
rm -f adaptive-learning-service.zip

# Create correct zip
zip adaptive-learning-service.zip index.js package.json

# Verify structure
unzip -l adaptive-learning-service.zip

# Deploy
aws lambda update-function-code \
  --function-name explore-speak-adaptive-learning-service \
  --zip-file fileb://adaptive-learning-service.zip \
  --region us-east-1

cd ../../..
```

## Key Difference

**WRONG** (creates nested structure):
```bash
zip -r vocabulary-service.zip .
```

**CORRECT** (index.js at root):
```bash
zip vocabulary-service.zip index.js package.json
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
```

Expected: Status 200 with no "Cannot find module 'index'" error.