#!/bin/bash

# Configuration
LOCAL_DIR="/opt/homebrew/var/www/Zero/code/zero-backend-admin"
REMOTE_USER="ubuntu"
REMOTE_HOST="13.61.175.181"
KEY_FILE="/Users/jamal/.ssh/zero-deployment-farahnaws-ec2.pem"
REMOTE_DIR="/var/www/zero-backend-admin"
PM2_APP_NAME="nextjs-app"

# Local Operations
echo "Starting local deployment operations..."
cd "$LOCAL_DIR" || { echo "Failed to change directory to $LOCAL_DIR"; exit 1; }

# Check for changes
if [[ -n $(git status -s) ]]; then
    echo "Changes detected. Committing and pushing..."
    git add .
    git commit -m "Deploying to production"
    git push origin2 main
else
    echo "No local changes to commit. Pushing anyway to ensure remote is up to date..."
    git push origin2 main
fi

# Remote Operations
echo "Connecting to remote server..."
ssh -i "$KEY_FILE" -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" << EOF
    echo "Connected to server."
    cd "$REMOTE_DIR" || { echo "Failed to change directory to $REMOTE_DIR"; exit 1; }
    
    echo "Pulling latest changes..."
    # Ensure we are on main branch
    git checkout main
    git pull origin main
    
    echo "Installing dependencies..."
    npm install

    echo "Building application..."
    npm run build

    echo "Restarting application..."
    pm2 restart "$PM2_APP_NAME"
    
    echo "Deployment complete."
EOF
