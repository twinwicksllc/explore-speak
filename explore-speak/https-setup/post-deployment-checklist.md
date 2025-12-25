# HTTPS Post-Deployment Checklist

## ✅ Pre-CloudFront Readiness
- [x] SSL Certificate issued and validated
- [x] CloudFront distribution created and deploying
- [x] Frontend code checked for HTTP URLs (clean!)

## 🔄 In Progress
- [ ] CloudFront deployment completion (typically 15-20 minutes)

## 📋 Next Steps (After CloudFront is Deployed)

### 1. Verify CloudFront Status
```bash
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID --query 'Distribution.Status'
# Should show 'Deployed'
```

### 2. Get CloudFront Domain Name
```bash
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID --query 'Distribution.DomainName'
```

### 3. Update Route53 Records
Replace `YOUR_CLOUDFRONT_DOMAIN` in the commands below:

```bash
# Apex domain update
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

# WWW domain update  
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

### 4. Deploy Updated Frontend
```bash
cd explore-speak/frontend
npm run build
aws s3 sync dist/ s3://explorespeak.com/ --delete

# Optional: Clear CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 🧪 Testing Checklist

### Basic Functionality
- [ ] https://explorespeak.com loads correctly
- [ ] https://www.explorespeak.com loads correctly
- [ ] HTTP redirects to HTTPS
- [ ] SSL certificate shows as valid

### Application Features
- [ ] User signup/login works
- [ ] Quests load and play correctly
- [ ] All API calls work over HTTPS
- [ ] Audio files play correctly

### Browser Validation
- [ ] No mixed content warnings
- [ ] Security padlock shows in browser
- [ ] Certificate info shows explorespeak.com

### Performance
- [ ] Page load time is acceptable
- [ ] Static assets load quickly
- [ ] API responses are fast

## 🔍 Troubleshooting Commands

### Check SSL Certificate
```bash
openssl s_client -connect explorespeak.com:443 -servername explorespeak.com
```

### Check DNS Resolution
```bash
dig explorespeak.com
dig www.explorespeak.com
```

### Check CloudFront Logs
```bash
aws logs get-log-events --log-group-name "/aws/cloudfront/YOUR_DISTRIBUTION_ID" --log-stream-name YOUR_LOG_STREAM
```

### Check S3 Website Configuration
```bash
aws s3api get-website-configuration --bucket explorespeak.com
```

## 📊 Success Metrics
- ✅ HTTPS access works globally
- ✅ No security warnings in browsers
- ✅ All app functionality preserved
- ✅ Improved performance with CloudFront
- ✅ Valid SSL certificate installed

## 🚨 If Issues Occur

### Certificate Issues
- Check: Certificate status and validity dates
- Fix: Ensure DNS validation completed properly

### CloudFront Issues  
- Check: Distribution status and error logs
- Fix: Verify origin configuration and SSL settings

### DNS Issues
- Check: Route53 record configuration
- Fix: Allow time for DNS propagation (up to 24 hours)

### Application Issues
- Check: API endpoints and CORS settings
- Fix: Update any hardcoded HTTP URLs

## 📞 Support
- AWS Console: https://console.aws.amazon.com/
- CloudFront: https://console.aws.amazon.com/cloudfront/
- Route53: https://console.aws.amazon.com/route53/
- ACM: https://console.aws.amazon.com/acm/

---

**Last Updated**: 2025-12-24  
**Project**: ExploreSpeak HTTPS Migration