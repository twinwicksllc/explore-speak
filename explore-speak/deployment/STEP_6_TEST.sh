#!/bin/bash

# Step 6: Test Everything
# Copy and paste these commands in your local terminal

echo "🧪 Testing Your Deployment..."

# Test vocabulary endpoint
echo "Testing vocabulary endpoint..."
curl "https://97w79t3en3.execute-api.us-east-1.amazonaws.com/prod/vocabulary/stats?userId=test&language=French"

echo ""
echo "Testing adaptive endpoint..."
curl "https://97w79t3en3.execute-api.us-east-1.amazonaws.com/prod/adaptive/profile?userId=test&language=French"

echo ""
echo "✅ API endpoints tested"
echo ""
echo "🌐 Now test the web application:"
echo ""
echo "1. Go to: https://explorespeak.com"
echo "2. Login or signup"
echo "3. Complete a quest"
echo "4. Check the dashboard for personalized recommendations"
echo "5. Click 'Review Vocabulary' to test SRS"
echo ""
echo "📊 Expected Results:"
echo "- Dashboard should show personalized recommendations"
echo "- Completing quests should add vocabulary to review"
echo "- Vocabulary review should work with flashcards"
echo "- Progress should be tracked"
echo ""
echo "🔍 If something doesn't work:"
echo "- Check CloudWatch logs: /aws/lambda/explorespeak-*"
echo "- Verify API Gateway in AWS Console"
echo "- Check browser developer console for errors"