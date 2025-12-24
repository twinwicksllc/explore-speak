# AWS CloudShell Setup Instructions

## Quick Start with AWS CloudShell (Easiest Method)

AWS CloudShell is a browser-based shell that comes with AWS CLI pre-installed and authenticated.

### 1. Open AWS CloudShell
1. Go to: https://console.aws.amazon.com/
2. Click the CloudShell icon (looks like `>_`) in the top navigation bar
3. Wait for the shell to load (takes about 30 seconds)

### 2. Clone the Repository
```bash
# Clone the explore-speak repository
gh repo clone twinwicksllc/explore-speak

# Navigate to the HTTPS setup directory
cd explore-speak/https-setup
```

### 3. Run the Setup Script
```bash
# Make the script executable
chmod +x setup-https.sh

# Run the automated HTTPS setup
./setup-https.sh
```

### 4. Follow the Prompts
The script will:
- Ask you to add DNS records to Route53
- Wait for certificate validation
- Create CloudFront distribution
- Update Route53 records
- Deploy the frontend

## Advantages of CloudShell
- ✅ No local installation required
- ✅ AWS CLI pre-installed and authenticated
- ✅ All AWS permissions already available
- ✅ Works in any browser
- ✅ Persistent storage between sessions

## If You Prefer Local Setup

### Prerequisites
- AWS CLI installed
- AWS credentials configured
- Git installed

### Commands
```bash
# Install AWS CLI (if needed)
# Mac: brew install awscli
# Linux: curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && sudo ./aws/install

# Configure AWS credentials
aws configure

# Clone repository
gh repo clone twinwicksllc/explore-speak
cd explore-speak/https-setup

# Run setup
chmod +x setup-https.sh
./setup-https.sh
```