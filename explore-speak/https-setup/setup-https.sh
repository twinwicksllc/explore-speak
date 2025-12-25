#!/bin/bash

# ExploreSpeak HTTPS Setup Script
# This script sets up CloudFront distribution and SSL certificate for explorespeak.com

set -e

echo "🚀 Setting up HTTPS for ExploreSpeak..."

# Variables
DOMAIN="explorespeak.com"
WWW_DOMAIN="www.explorespeak.com"
S3_BUCKET="explorespeak.com"
S3_WEBSITE_ENDPOINT="explorespeak.com.s3-website-us-east-1.amazonaws.com"

echo "📋 Configuration:"
echo "  Domain: $DOMAIN"
echo "  S3 Bucket: $S3_BUCKET"
echo "  Region: us-east-1"

# Step 1: Request SSL Certificate
echo "🔒 Step 1: Requesting SSL certificate..."
CERTIFICATE_ARN=$(aws acm request-certificate \
    --domain-name $DOMAIN \
    --subject-alternative-names $WWW_DOMAIN \
    --validation-method DNS \
    --region us-east-1 \
    --query 'CertificateArn' \
    --output text)

echo "  Certificate ARN: $CERTIFICATE_ARN"

# Step 2: Get DNS validation records
echo "📝 Step 2: Getting DNS validation records..."
aws acm describe-certificate \
    --certificate-arn $CERTIFICATE_ARN \
    --region us-east-1 \
    --query 'Certificate.DomainValidationOptions[*].[DomainName,ValidationRecord.Name,ValidationRecord.Value]' \
    --output table

echo "⚠️  Please add the above CNAME records to your Route53 hosted zone before proceeding!"
read -p "Press Enter once DNS records are added and validated..."

# Step 3: Wait for certificate validation
echo "⏳ Step 3: Waiting for certificate validation..."
aws acm wait certificate-validated \
    --certificate-arn $CERTIFICATE_ARN \
    --region us-east-1

echo "✅ Certificate validated!"

# Step 4: Create CloudFront distribution
echo "☁️  Step 4: Creating CloudFront distribution..."
TIMESTAMP=$(date +%s)
sed "s/\${timestamp}/$TIMESTAMP/g" cloudfront-config.json > cloudfront-config-$TIMESTAMP.json

# Update certificate ARN in config
sed -i.bak "s/&quot;CloudFrontDefaultCertificate&quot;: false/&quot;ACMCertificateArn&quot;: &quot;$CERTIFICATE_ARN&quot;/" cloudfront-config-$TIMESTAMP.json
sed -i 's/&quot;SSLSupportMethod&quot;: &quot;sni-only&quot;/&quot;SSLSupportMethod&quot;: &quot;sni-only&quot;/' cloudfront-config-$TIMESTAMP.json

DISTRIBUTION_ID=$(aws cloudfront create-distribution \
    --distribution-config file://cloudfront-config-$TIMESTAMP.json \
    --query 'Distribution.Id' \
    --output text)

echo "  Distribution ID: $DISTRIBUTION_ID"

# Step 5: Wait for CloudFront distribution to deploy
echo "⏳ Step 5: Waiting for CloudFront distribution to deploy (this can take 15-20 minutes)..."
aws cloudfront wait distribution-deployed \
    --id $DISTRIBUTION_ID

echo "✅ CloudFront distribution deployed!"

# Step 6: Get CloudFront domain name
CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution \
    --id $DISTRIBUTION_ID \
    --query 'Distribution.DomainName' \
    --output text)

echo "  CloudFront Domain: $CLOUDFRONT_DOMAIN"

# Step 7: Update Route53 records
echo "📍 Step 6: Updating Route53 records..."

# Get hosted zone ID
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones \
    --query "HostedZones[?Name==\`explorespeak.com.\`].Id" \
    --output text | sed 's/.*\///')

echo "  Hosted Zone ID: $HOSTED_ZONE_ID"

# Update Route53 record for apex domain
cat > route53-update-apex.json <<EOF
{
    "Comment": "Update apex domain to CloudFront",
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "$DOMAIN",
                "Type": "A",
                "AliasTarget": {
                    "HostedZoneId": "Z2FDTNDATAQYW2",
                    "DNSName": "$CLOUDFRONT_DOMAIN",
                    "EvaluateTargetHealth": false
                }
            }
        }
    ]
}
EOF

aws route53 change-resource-record-sets \
    --hosted-zone-id $HOSTED_ZONE_ID \
    --change-batch file://route53-update-apex.json

# Update Route53 record for www domain
cat > route53-update-www.json <<EOF
{
    "Comment": "Update www domain to CloudFront",
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "$WWW_DOMAIN",
                "Type": "A",
                "AliasTarget": {
                    "HostedZoneId": "Z2FDTNDATAQYW2",
                    "DNSName": "$CLOUDFRONT_DOMAIN",
                    "EvaluateTargetHealth": false
                }
            }
        }
    ]
}
EOF

aws route53 change-resource-record-sets \
    --hosted-zone-id $HOSTED_ZONE_ID \
    --change-batch file://route53-update-www.json

echo "✅ Route53 records updated!"

# Step 8: Update frontend code to use HTTPS
echo "🔧 Step 7: Updating frontend configuration..."
cd ../frontend

# Update API configuration to use HTTPS
sed -i.bak 's/https:\/\/wtu71yyi3m.execute-api.us-east-1.amazonaws.com/https:\/\/wtu71yyi3m.execute-api.us-east-1.amazonaws.com/g' src/config/api.js

# Build and deploy
echo "📦 Building and deploying frontend..."
npm run build
aws s3 sync dist/ s3://$S3_BUCKET/ --delete

echo "🎉 HTTPS setup complete!"
echo ""
echo "📋 Summary:"
echo "  CloudFront Distribution: https://console.aws.amazon.com/cloudfront/home#/distributions/$DISTRIBUTION_ID"
echo "  SSL Certificate: https://console.aws.amazon.com/acm/home#/certificates/$CERTIFICATE_ARN"
echo "  Website: https://$DOMAIN"
echo "  API: https://wtu71yyi3m.execute-api.us-east-1.amazonaws.com"
echo ""
echo "⚠️  Important: CloudFront may take a few more minutes to propagate globally."

# Cleanup
cd ../https-setup
rm -f cloudfront-config-$TIMESTAMP.json cloudfront-config-$TIMESTAMP.json.bak
rm -f route53-update-apex.json route53-update-www.json