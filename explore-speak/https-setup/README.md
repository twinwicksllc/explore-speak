# HTTPS Setup for ExploreSpeak

This directory contains the configuration and scripts to enable HTTPS for ExploreSpeak using AWS CloudFront and SSL certificates.

## Prerequisites

1. **AWS CLI** installed and configured with appropriate permissions
2. **Route53** hosted zone for `explorespeak.com`
3. **S3 bucket** `explorespeak.com` with static website hosting
4. **IAM permissions** for:
   - ACM (Certificate Manager)
   - CloudFront
   - Route53
   - S3

## Quick Setup

### Option 1: Automated Setup (Recommended)

Run the automated setup script:

```bash
cd explore-speak/https-setup
chmod +x setup-https.sh
./setup-https.sh
```

This script will:
1. Request an SSL certificate from AWS ACM
2. Provide DNS validation records for you to add to Route53
3. Create a CloudFront distribution
4. Update Route53 records to point to CloudFront
5. Update frontend code to use HTTPS
6. Build and deploy the updated frontend

### Option 2: Manual Setup

Follow these steps manually:

#### 1. Request SSL Certificate

```bash
aws acm request-certificate \
    --domain-name explorespeak.com \
    --subject-alternative-names www.explorespeak.com \
    --validation-method DNS \
    --region us-east-1
```

#### 2. Add DNS Validation Records

Get the validation records:

```bash
aws acm describe-certificate \
    --certificate-arn <CERTIFICATE_ARN> \
    --region us-east-1
```

Add the CNAME records to Route53.

#### 3. Create CloudFront Distribution

Update the `cloudfront-config.json` with your certificate ARN:

```json
{
  "CallerReference": "explorespeak-cloudfront-$(date +%s)",
  "Comment": "CloudFront distribution for explorespeak.com with HTTPS",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-explorespeak.com",
        "DomainName": "explorespeak.com.s3-website-us-east-1.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-explorespeak.com",
    "ViewerProtocolPolicy": "redirect-to-https",
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0
  },
  "Enabled": true,
  "Aliases": {
    "Quantity": 2,
    "Items": [
      "explorespeak.com",
      "www.explorespeak.com"
    ]
  },
  "ViewerCertificate": {
    "ACMCertificateArn": "<YOUR_CERTIFICATE_ARN>",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021"
  }
}
```

Create the distribution:

```bash
aws cloudfront create-distribution \
    --distribution-config file://cloudfront-config.json
```

#### 4. Update Route53 Records

```bash
# Apex domain
aws route53 change-resource-record-sets \
    --hosted-zone-id <HOSTED_ZONE_ID> \
    --change-batch '{
        "Comment": "Update apex domain to CloudFront",
        "Changes": [{
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "explorespeak.com",
                "Type": "A",
                "AliasTarget": {
                    "HostedZoneId": "Z2FDTNDATAQYW2",
                    "DNSName": "<CLOUDFRONT_DOMAIN_NAME>",
                    "EvaluateTargetHealth": false
                }
            }
        }]
    }'

# WWW domain
aws route53 change-resource-record-sets \
    --hosted-zone-id <HOSTED_ZONE_ID> \
    --change-batch '{
        "Comment": "Update www domain to CloudFront",
        "Changes": [{
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "www.explorespeak.com",
                "Type": "A",
                "AliasTarget": {
                    "HostedZoneId": "Z2FDTNDATAQYW2",
                    "DNSName": "<CLOUDFRONT_DOMAIN_NAME>",
                    "EvaluateTargetHealth": false
                }
            }
        }]
    }'
```

#### 5. Update Frontend Code

Update `frontend/src/config/api.js` to ensure HTTPS URLs:

```javascript
export const API_BASE_URL = 'https://wtu71yyi3m.execute-api.us-east-1.amazonaws.com';
```

#### 6. Build and Deploy

```bash
cd frontend
npm run build
aws s3 sync dist/ s3://explorespeak.com/ --delete
```

## Configuration Details

### CloudFront Distribution Settings

- **Origin**: S3 website endpoint (explorespeak.com.s3-website-us-east-1.amazonaws.com)
- **Viewer Protocol Policy**: Redirect HTTP to HTTPS
- **SSL Certificate**: ACM certificate for explorespeak.com and www.explorespeak.com
- **Custom Error Responses**: 404 → /index.html (for SPA routing)
- **Caching**: Default TTL 0 (can be optimized later)

### Security Settings

- **Minimum Protocol Version**: TLSv1.2_2021
- **SSL Support Method**: SNI-only
- **Forward Query Strings**: No
- **Forward Cookies**: None

## Verification

After setup, verify:

1. **HTTPS Access**: https://explorespeak.com
2. **HTTP Redirect**: http://explorespeak.com → https://explorespeak.com
3. **SSL Certificate**: Valid for explorespeak.com and www.explorespeak.com
4. **API Connectivity**: All API calls work over HTTPS
5. **SPA Routing**: All routes work correctly

## Troubleshooting

### Certificate Validation

If certificate validation fails:
1. Check DNS propagation for validation records
2. Ensure CNAME records are correctly configured
3. Wait longer for DNS propagation (can take up to 24 hours)

### CloudFront Issues

If CloudFront distribution fails:
1. Check S3 bucket permissions
2. Verify origin configuration
3. Ensure SSL certificate is validated

### DNS Issues

If domain doesn't resolve:
1. Check Route53 record configuration
2. Verify CloudFront distribution is deployed
3. Check DNS propagation

## Cost Impact

- **CloudFront**: ~$0.02/GB data transfer + $0.0075/10,000 requests
- **ACM**: Free for public SSL certificates
- **Route53**: No additional cost (standard query fees apply)

## Next Steps

1. **Monitor**: Set up CloudWatch alarms for CloudFront
2. **Optimize**: Configure caching headers for static assets
3. **Security**: Consider adding WAF for additional protection
4. **Performance**: Enable compression and additional optimizations