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
    
    # Handle remote origin2 if not exists
    if ! git remote | grep -q "origin2"; then
        if git remote | grep -q "origin"; then
            echo "Renaming origin to origin2..."
            git remote rename origin origin2
        else
            echo "Error: Remote origin2 not found and origin not found. Please check git configuration."
            exit 1
        fi
    fi

    echo "Resetting local changes..."
    git reset --hard HEAD

    echo "Pulling latest changes..."
    # Ensure we are on main branch
    git checkout main
    git pull origin2 main
    
    echo "Installing dependencies..."
    npm install

    echo "Building application..."
    npm run build

    echo "Restarting application..."
    if pm2 list | grep -q "$PM2_APP_NAME"; then
        pm2 restart "$PM2_APP_NAME"
    else
        echo "App not running, starting it..."
        pm2 start npm --name "$PM2_APP_NAME" -- start
    fi
    
    echo "Saving PM2 process list..."
    pm2 save

    echo "Deployment complete."
EOF
