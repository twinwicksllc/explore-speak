# ExploreSpeak SRS & Adaptive Learning Deployment Guide

## 🚀 Quick Start - One Command Deployment

Run this single command to deploy everything:

```bash
chmod +x deployment/deploy-all.sh
./deployment/deploy-all.sh
```

This will:
1. ✅ Create DynamoDB tables
2. ✅ Deploy Lambda functions  
3. ✅ Configure API Gateway
4. ✅ Integrate frontend
5. ✅ Build and deploy frontend
6. ✅ Invalidate CloudFront cache

---

## 📋 Prerequisites

### Required Tools
- AWS CLI (installed and configured)
- Node.js 18.x
- Bash shell

### AWS Permissions
Make sure your AWS user has these permissions:
- DynamoDB: CreateTable, UpdateTable
- Lambda: CreateFunction, UpdateFunction, AddPermission
- API Gateway: CreateResource, PutMethod, PutIntegration
- S3: PutObject, DeleteObject
- CloudFront: CreateInvalidation

---

## 🔧 Individual Deployment Steps

If you want to run steps individually:

### Step 1: Create DynamoDB Tables
```bash
chmod +x deployment/dynamodb-setup.sh
./deployment/dynamodb-setup.sh
```

**Tables Created:**
- `ExploreSpeak-VocabularyCards`
- `ExploreSpeak-ReviewSessions` 
- `ExploreSpeak-LearnerProfiles`
- `ExploreSpeak-Performance`

### Step 2: Deploy Lambda Functions
```bash
chmod +x deployment/lambda-deploy.sh
./deployment/lambda-deploy.sh
```

**Functions Deployed:**
- `explorespeak-vocabulary-service`
- `explorespeak-adaptive-learning-service`

### Step 3: Setup API Gateway
```bash
chmod +x deployment/api-gateway-setup.sh
./deployment/api-gateway-setup.sh
```

**Endpoints Created:**
- `GET /vocabulary/due`
- `POST /vocabulary/update`
- `POST /vocabulary/add`
- `GET /vocabulary/stats`
- `GET /adaptive/profile`
- `POST /adaptive/profile/update`
- `GET /adaptive/recommendations`
- And more...

### Step 4: Integrate Frontend
```bash
chmod +x deployment/frontend-integration.sh
./deployment/frontend-integration.sh
```

**Changes Made:**
- Added `/vocabulary/review` route
- Updated dashboard to use PersonalizedDashboard
- Integrated SRS with quest completion

### Step 5: Build and Deploy Frontend
```bash
cd frontend
npm install
npm run build
aws s3 sync dist/ s3://explorespeak.com --delete
aws cloudfront create-invalidation --distribution-id E3EXV0XICCR1ZH --paths "/*"
```

---

## 🧪 Testing the Deployment

### 1. Test API Endpoints
```bash
# Test vocabulary service
curl "https://97w79t3en3.execute-api.us-east-1.amazonaws.com/prod/vocabulary/stats?userId=test&language=French"

# Test adaptive learning service  
curl "https://97w79t3en3.execute-api.us-east-1.amazonaws.com/prod/adaptive/profile?userId=test&language=French"
```

### 2. Test Frontend Features
1. Go to https://explorespeak.com
2. Login or signup
3. Complete a quest
4. Check dashboard for recommendations
5. Click "Review Vocabulary" to test SRS

---

## 🔍 Troubleshooting

### DynamoDB Issues
```bash
# Check if tables exist
aws dynamodb list-tables --query "TableNames[?contains(@, 'ExploreSpeak')]"

# Check table status
aws dynamodb describe-table --table-name ExploreSpeak-VocabularyCards
```

### Lambda Issues
```bash
# Check function logs
aws logs tail /aws/lambda/explorespeak-vocabulary-service --follow
aws logs tail /aws/lambda/explorespeak-adaptive-learning-service --follow

# Test function directly
aws lambda invoke --function-name explorespeak-vocabulary-service out.json
```

### API Gateway Issues
```bash
# Check API Gateway deployment
aws apigateway get-deployments --rest-api-id 97w79t3en3

# Test endpoint directly
curl -X GET "https://97w79t3en3.execute-api.us-east-1.amazonaws.com/prod/vocabulary/stats?userId=test&language=French"
```

### Frontend Issues
```bash
# Check S3 deployment
aws s3 ls s3://explorespeak.com

# Clear CloudFront cache
aws cloudfront create-invalidation --distribution-id E3EXV0XICCR1ZH --paths "/index.html"
```

---

## 📊 Monitoring

### CloudWatch Metrics to Watch
- Lambda invocation count and errors
- DynamoDB read/write capacity
- API Gateway 4xx/5xx errors
- S3 request metrics

### Expected Costs After Deployment
- **DynamoDB**: $10-20/month (4 tables, provisioned throughput)
- **Lambda**: $5-15/month (2 functions, low usage)
- **API Gateway**: $5-10/month (usage-based)
- **Total**: ~$20-45/month additional

---

## 🔄 Rollback Plan

If something goes wrong:

### Quick Rollback to Previous Frontend
```bash
# Restore previous frontend build (if you have backup)
aws s3 sync backup/ s3://explorespeak.com --delete
aws cloudfront create-invalidation --distribution-id E3EXV0XICCR1ZH --paths "/*"
```

### Disable New Features
```bash
# Remove new routes from App.tsx
# Restore previous QuestComplete.tsx
# Rebuild and redeploy frontend
```

### Delete New Resources (Last Resort)
```bash
# Delete Lambda functions
aws lambda delete-function --function-name explorespeak-vocabulary-service
aws lambda delete-function --function-name explorespeak-adaptive-learning-service

# Delete DynamoDB tables
aws dynamodb delete-table --table-name ExploreSpeak-VocabularyCards
aws dynamodb delete-table --table-name ExploreSpeak-ReviewSessions
aws dynamodb delete-table --table-name ExploreSpeak-LearnerProfiles
aws dynamodb delete-table --table-name ExploreSpeak-Performance
```

---

## 🎯 Success Criteria

Your deployment is successful if:

✅ **Frontend Loads**: https://explorespeak.com works normally
✅ **New Routes**: `/vocabulary/review` is accessible  
✅ **API Endpoints**: All new endpoints return 200 responses
✅ **SRS Integration**: Completing quests adds vocabulary cards
✅ **Recommendations**: Dashboard shows personalized quests
✅ **No Errors**: CloudWatch logs show no critical errors

---

## 📞 Support

If you encounter issues:

1. Check CloudWatch logs first
2. Test API endpoints individually
3. Verify AWS resource configuration
4. Check this README for troubleshooting steps

All deployment scripts are idempotent - you can run them multiple times safely.