#!/bin/bash

# Step 5: Update and Deploy Frontend
# Copy and paste these commands in your local terminal

echo "🚀 Updating and Deploying Frontend..."

# Navigate to frontend directory
cd explore-speak/frontend

# Install dependencies
npm install

# Update App.tsx and other files (run integration script)
cd ..
./deployment/frontend-integration.sh

# Build frontend
cd frontend
npm run build

echo "✅ Frontend built successfully"

# Deploy to S3
aws s3 sync dist/ s3://explorespeak.com --delete

echo "✅ Frontend deployed to S3"

# Clear CloudFront cache
aws cloudfront create-invalidation --distribution-id E3EXV0XICCR1ZH --paths "/*"

echo "✅ CloudFront cache invalidated"
echo ""
echo "🎉 Frontend deployment complete!"
echo ""
echo "🌐 Your new features are live at: https://explorespeak.com"
echo ""
echo "⏳ Wait 2-3 minutes for CloudFront to propagate changes"
echo "🧪 Then clear your browser cache and test the new features!"