#!/bin/bash

# Complete Deployment Script
# Runs all deployment steps in order

set -e  # Exit on any error

echo "🚀 Starting Complete Deployment of ExploreSpeak SRS & Adaptive Learning"
echo "=================================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}📍 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if user is logged in to AWS
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

print_success "AWS CLI is configured"

# Step 1: Create DynamoDB Tables
print_step "Step 1: Creating DynamoDB Tables"
if ./deployment/dynamodb-setup.sh; then
    print_success "DynamoDB tables created successfully"
else
    print_error "Failed to create DynamoDB tables"
    exit 1
fi

echo ""
echo "⏳ Waiting 30 seconds for tables to be fully available..."
sleep 30

# Step 2: Deploy Lambda Functions
print_step "Step 2: Deploying Lambda Functions"
if ./deployment/lambda-deploy.sh; then
    print_success "Lambda functions deployed successfully"
else
    print_error "Failed to deploy Lambda functions"
    exit 1
fi

# Step 3: Setup API Gateway
print_step "Step 3: Setting up API Gateway"
if ./deployment/api-gateway-setup.sh; then
    print_success "API Gateway setup completed"
else
    print_error "Failed to setup API Gateway"
    exit 1
fi

# Step 4: Update Frontend
print_step "Step 4: Integrating Frontend"
if ./deployment/frontend-integration.sh; then
    print_success "Frontend integration completed"
else
    print_error "Failed to integrate frontend"
    exit 1
fi

# Step 5: Build Frontend
print_step "Step 5: Building Frontend"
cd frontend
npm install
npm run build
if [ $? -eq 0 ]; then
    print_success "Frontend built successfully"
else
    print_error "Failed to build frontend"
    exit 1
fi
cd ..

# Step 6: Deploy to S3
print_step "Step 6: Deploying Frontend to S3"
if aws s3 sync frontend/dist/ s3://explorespeak.com --delete; then
    print_success "Frontend deployed to S3"
else
    print_error "Failed to deploy frontend to S3"
    exit 1
fi

# Step 7: Invalidate CloudFront
print_step "Step 7: Invalidating CloudFront Cache"
if aws cloudfront create-invalidation --distribution-id E3EXV0XICCR1ZH --paths "/*"; then
    print_success "CloudFront cache invalidated"
else
    print_warning "Failed to invalidate CloudFront cache (may need manual invalidation)"
fi

echo ""
echo "🎉 DEPLOYMENT COMPLETE! 🎉"
echo "=================================================================="
echo ""
print_success "All components deployed successfully:"
echo "  ✅ DynamoDB tables created"
echo "  ✅ Lambda functions deployed"
echo "  ✅ API Gateway endpoints configured"
echo "  ✅ Frontend integrated and deployed"
echo ""
echo "🌐 Your new features are now live at: https://explorespeak.com"
echo ""
echo "📊 New Features Available:"
echo "  📚 Vocabulary Review (SRS)"
echo "  🤖 Personalized Quest Recommendations"
echo "  📈 Adaptive Learning Analytics"
echo "  🎯 Daily Goals"
echo ""
echo "🧪 Test the new features:"
echo "  1. Complete a quest to add vocabulary to review"
echo "  2. Check dashboard for personalized recommendations"
echo "  3. Click 'Review Vocabulary' to start SRS session"
echo ""
print_warning "Important:"
echo "  - Wait 2-3 minutes for CloudFront to propagate changes"
echo "  - Clear browser cache before testing"
echo "  - Monitor CloudWatch logs for any issues"
echo ""
echo "📞 If you encounter any issues:"
echo "  - Check CloudWatch logs: /aws/lambda/explorespeak-*"
echo "  - Verify API Gateway endpoints in AWS Console"
echo "  - Test individual endpoints with curl/Postman"