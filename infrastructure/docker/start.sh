#!/bin/bash
# Aether Shield Startup Script
# This script starts all services in a single container

set -e

echo "🛡️  Starting Aether Shield..."

# Load environment variables
if [ -f .env ]; then
    echo "📝 Loading .env file..."
    set -a
    . .env
    set +a
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
fi

# Database migration and setup
echo "🗄️  Setting up database..."
cd /app
npx prisma migrate deploy
npx prisma generate

# Start Go server in background
echo "⚙️  Starting Go server on port 8080..."
/usr/local/bin/aether-shield-server &
SERVER_PID=$!

# Wait for server to be ready
echo "⏳ Waiting for Go server to start..."
sleep 5

# Start Next.js application
echo "🎨 Starting Next.js application on port 3000..."
cd /app
node server.js

# Cleanup on exit
echo "🛑 Shutting down Aether Shield..."
kill $SERVER_PID 2>/dev/null
wait $SERVER_PID 2>/dev/null

echo "✅ Aether Shield stopped gracefully"
