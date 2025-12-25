# AWS Resources Configuration

## Cognito User Pools

### Production
- **User Pool ID:** `us-east-1_BLKJlarT5`
- **Client ID:** `5ih0pvk03s1ct6ilrekgp8ak46`
- **Pool Name:** ExploreSpeak-Prod
- **Region:** us-east-1

### Staging
- **User Pool ID:** `us-east-1_ZrrrpfMro`
- **Client ID:** `30c2ke0dk6e59r847q9dojmju`
- **Pool Name:** ExploreSpeak-Staging
- **Region:** us-east-1

### Development
- **User Pool ID:** `us-east-1_SYpS31AZH`
- **Client ID:** `7okg34ejj9dmmo7d761hllaf86`
- **Pool Name:** ExploreSpeak-Dev
- **Region:** us-east-1

## DynamoDB Tables

### Production (Migrated from LanguageQuest)
- `ExploreSpeak-Users`
- `ExploreSpeak-Quests`
- `ExploreSpeak-UserQuestProgress`
- `ExploreSpeak-UserVocabulary`
- `ExploreSpeak-Conversations`
- `ExploreSpeak-UserExerciseAttempts`

### Development & Staging
*To be created with same schema as production*

## S3 Buckets

### Production
- `explorespeak.com` - Main website
- `www.explorespeak.com` - WWW redirect

### Development
- `explorespeak-dev` - To be created

### Staging
- `explorespeak-staging` - To be created

## Lambda Functions

### Production
- `language-quest-LanguageQuestFunction-SuI5PmIwU0S7` - Main API function (to be renamed)

### Development & Staging
*To be created*

## API Gateway

### Production
- HTTP API ID: `wtu71yyi3m`
- Endpoint: `https://wtu71yyi3m.execute-api.us-east-1.amazonaws.com`

### Development & Staging
*To be created*

## Notes
- All resources are in `us-east-1` region
- Production resources migrated from LanguageQuest naming
- Dev and Staging environments use simplified configurations for faster development
