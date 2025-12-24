# HTTPS Deployment Commands

## Manual AWS CLI Commands for HTTPS Setup

### 1. Install AWS CLI (if not already installed)

```bash
# For Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Verify installation
aws --version
```

### 2. Configure AWS Credentials

```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter default region: us-east-1
# Enter default output format: json
```

### 3. Request SSL Certificate

```bash
# Request certificate for both domains
aws acm request-certificate \
    --domain-name explorespeak.com \
    --subject-alternative-names www.explorespeak.com \
    --validation-method DNS \
    --region us-east-1

# Note the Certificate ARN from the output
```

### 4. Get DNS Validation Records

```bash
# Replace CERTIFICATE_ARN with the ARN from previous step
aws acm describe-certificate \
    --certificate-arn arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/CERTIFICATE_ID \
    --region us-east-1 \
    --query 'Certificate.DomainValidationOptions[*].[DomainName,ValidationRecord.Name,ValidationRecord.Value]' \
    --output table
```

### 5. Add CNAME Records to Route53

Go to Route53 console and add the CNAME records shown in step 4.

### 6. Wait for Certificate Validation

```bash
# Monitor certificate status
aws acm describe-certificate \
    --certificate-arn arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/CERTIFICATE_ID \
    --region us-east-1 \
    --query 'Certificate.Status'

# Wait until status is ISSUED
```

### 7. Create CloudFront Distribution

```bash
# First, update the cloudfront-config.json with your certificate ARN
# Replace YOUR_CERTIFICATE_ARN in the file

aws cloudfront create-distribution \
    --distribution-config file://cloudfront-config.json
```

### 8. Wait for CloudFront Deployment

```bash
# Get distribution ID
aws cloudfront list-distributions \
    --query 'DistributionList.Items[?Comment.Contains(`explorespeak`) == `true`].Id' \
    --output text

# Wait for deployment (this can take 15-20 minutes)
aws cloudfront wait distribution-deployed \
    --id DISTRIBUTION_ID
```

### 9. Update Route53 Records

```bash
# Get CloudFront domain name
aws cloudfront get-distribution \
    --id DISTRIBUTION_ID \
    --query 'Distribution.DomainName' \
    --output text

# Update apex domain
aws route53 change-resource-record-sets \
    --hosted-zone-id Z0464354MXQG3RVJDMQ3 \
    --change-batch '{
        "Comment": "Update apex domain to CloudFront",
        "Changes": [{
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "explorespeak.com",
                "Type": "A",
                "AliasTarget": {
                    "HostedZoneId": "Z2FDTNDATAQYW2",
                    "DNSName": "YOUR_CLOUDFRONT_DOMAIN.cloudfront.net",
                    "EvaluateTargetHealth": false
                }
            }
        }]
    }'

# Update www domain
aws route53 change-resource-record-sets \
    --hosted-zone-id Z0464354MXQG3RVJDMQ3 \
    --change-batch '{
        "Comment": "Update www domain to CloudFront",
        "Changes": [{
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "www.explorespeak.com",
                "Type": "A",
                "AliasTarget": {
                    "HostedZoneId": "Z2FDTNDATAQYW2",
                    "DNSName": "YOUR_CLOUDFRONT_DOMAIN.cloudfront.net",
                    "EvaluateTargetHealth": false
                }
            }
        }]
    }'
```

### 10. Update and Deploy Frontend

```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Deploy to S3
aws s3 sync dist/ s3://explorespeak.com/ --delete

# Invalidate CloudFront cache (optional but recommended)
aws cloudfront create-invalidation \
    --distribution-id DISTRIBUTION_ID \
    --paths "/*"
```

### 11. Verify HTTPS Setup

```bash
# Test HTTPS access
curl -I https://explorespeak.com

# Test HTTP redirect
curl -I -L http://explorespeak.com

# Check SSL certificate
openssl s_client -connect explorespeak.com:443 -servername explorespeak.com
```

## Quick Test Commands

```bash
# Check current DNS records
dig explorespeak.com
dig www.explorespeak.com

# Check CloudFront distribution status
aws cloudfront get-distribution --id DISTRIBUTION_ID --query 'Distribution.Status'

# Check SSL certificate
aws acm describe-certificate --certificate-arn YOUR_CERTIFICATE_ARN --region us-east-1 --query 'Certificate.Status'
```

## Troubleshooting Commands

```bash
# Check Route53 record changes
aws route53 list-resource-record-sets \
    --hosted-zone-id Z0464354MXQG3RVJDMQ3 \
    --query 'ResourceRecordSets[?Type==`A` || Type==`CNAME`]'

# Check CloudFront logs (if enabled)
aws logs describe-log-groups --log-group-name-prefix "/aws/cloudfront"

# Check S3 website configuration
aws s3api get-website-configuration --bucket explorespeak.com

# Check S3 bucket policy
aws s3api get-bucket-policy --bucket explorespeak.com
```

## Important Notes

1. **Region**: All resources must be in us-east-1 for CloudFront SSL certificate
2. **Certificate Validation**: Can take 15-30 minutes after DNS records are added
3. **CloudFront Deployment**: Typically takes 15-20 minutes
4. **DNS Propagation**: Can take up to 24 hours globally
5. **Cost**: ACM certificates are free, CloudFront has data transfer costs

## Validation Checklist

- [ ] SSL certificate is ISSUED status
- [ ] CloudFront distribution is Deployed status
- [ ] Route53 records point to CloudFront domain
- [ ] HTTPS access works: https://explorespeak.com
- [ ] HTTP redirects to HTTPS
- [ ] All API endpoints work over HTTPS
- [ ] SPA routing works correctly
- [ ] No mixed content warnings in browser