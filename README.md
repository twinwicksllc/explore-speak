# Language Quest - Portuguese Learning & Travel Planning App

A travel-themed Portuguese learning application featuring Sofia, an AI Brazilian travel advisor who helps users plan authentic trips to Brazil while teaching Portuguese language and culture.

## 🌟 Features

- **AI Travel Advisor**: Sofia Oliveira - your 28-year-old Brazilian travel guide
- **Language Learning**: Integrated Portuguese phrases with translations and cultural context
- **Conversation Persistence**: Full chat history maintained across sessions
- **Authentic Experience**: Real Brazilian cultural insights and travel recommendations
- **Responsive Design**: Mobile-friendly web interface

## 🚀 Live Demo

**Frontend**: https://travel.twin-wicks.com

## 🏗️ Architecture

### Frontend
- **Tech Stack**: HTML5, CSS3, JavaScript (ES6+)
- **Features**: Real-time chat interface, Brazilian-themed design
- **Hosting**: AWS S3 + CloudFront CDN

### Backend
- **API**: REST API via AWS API Gateway
- **Compute**: AWS Lambda (Node.js 18.x)
- **Database**: AWS DynamoDB
- **AI**: Amazon Bedrock with Claude 3 Sonnet

### Key Components
- **Conversation Lambda**: Handles AI interactions via Bedrock
- **User Management Lambda**: Manages user accounts and profiles
- **Progress Tracking Lambda**: Tracks learning progress
- **DynamoDB Tables**: users, conversations, progress tracking

## 🤖 Sofia AI System

### Personality
Sofia Oliveira is a 28-year-old Brazilian travel advisor from Rio de Janeiro who:
- Is warm, enthusiastic, and knowledgeable about Brazilian culture
- Speaks fluent Portuguese and English
- Loves sharing authentic Brazilian experiences
- Incorporates Portuguese phrases naturally in conversation

### AI Architecture
- **Layer 1**: Cached personality prompt (90% cost savings)
- **Layer 2**: Dynamic conversation context
- **Layer 3**: Post-processing guardrails
- **Model**: Claude 3 Sonnet via Amazon Bedrock

## 🛠️ Development

### Prerequisites
- AWS CLI configured with appropriate permissions
- Node.js 18.x or later
- AWS CDK (for infrastructure deployment)

### Quick Start
```bash
# Clone repository
git clone https://github.com/twinwicksllc/LanguageQuest.git
cd LanguageQuest

# Install dependencies
npm install

# Deploy backend infrastructure
cd backend
# Configure AWS credentials via environment variables
# Deploy Lambda functions

# Frontend is already deployed at https://travel.twin-wicks.com
```

## 📊 AWS Services Used

| Service | Purpose |
|---------|---------|
| **Lambda** | Serverless compute for backend APIs |
| **API Gateway** | REST API endpoints |
| **DynamoDB** | NoSQL database for data persistence |
| **S3** | Static website hosting |
| **CloudFront** | CDN for frontend assets |
| **Bedrock** | AI/ML model inference |
| **Cognito** | User authentication |
| **Route 53** | DNS management |

## 🔧 Technical Implementation

### API Endpoints
- `POST /conversations` - Chat with Sofia
- `GET /users/{userId}` - Get user profile
- `POST /users` - Create/update user
- `GET /progress/{userId}` - Get learning progress
- `POST /progress` - Update learning progress

### Database Schema
```javascript
// Users Table
{
  userId: string,
  email: string,
  profile: {
    name: string,
    preferences: object,
    level: string
  },
  createdAt: string,
  updatedAt: string
}

// Conversations Table
{
  conversationId: string,
  userId: string,
  messages: [
    {
      role: 'user' | 'assistant',
      content: string,
      timestamp: string
    }
  ],
  lastUpdated: string
}
```

## 🐛 Troubleshooting

### Bedrock Model Access
If encountering AWS Marketplace subscription errors:
```bash
# Test model availability
node scripts/test-bedrock-access.js

# Use Claude 3 Sonnet instead of Haiku
modelId: 'anthropic.claude-3-sonnet-20240229-v1:0'
```

### Lambda Timeouts
Increase timeout and memory for AI calls:
```bash
aws lambda update-function-configuration \
  --function-name language-quest-conversation \
  --timeout 10 \
  --memory-size 256
```

## 📈 Performance & Cost Optimization

### Cost-Saving Strategies
- **Prompt Caching**: 90% reduction in AI costs
- **Lambda Memory**: Optimized for cost vs performance
- **CloudFront**: Reduced data transfer costs
- **DynamoDB**: On-demand pricing for variable workloads

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Amazon Web Services for the serverless infrastructure
- Anthropic for the Claude AI models
- The Brazilian culture and Portuguese language community

---

**Language Quest** - Making Portuguese learning an adventure! 🇧🇷✈️