#!/bin/bash
# Start script for Aether Shield development environment
#
# This script ensures proper startup order:
# 1. Wait for database to be ready
# 2. Run Prisma migrations
# 3. Start Go server with hot-reload
# 4. Start Next.js app with hot-reload

set -e

echo "Starting Aether Shield development environment..."

# Wait for database to be ready
echo "Waiting for database to be ready..."
while ! pg_isready -h db -U postgres; do
  sleep 1
  echo "Database not ready yet..."
done
echo "Database is ready!"

# Run Prisma migrations
echo "Running Prisma migrations..."
cd /app/prisma
npx prisma migrate dev --name init
echo "Prisma migrations completed!"

# Start Go server with hot-reload in background
echo "Starting Go server with hot-reload..."
cd /app/server/src

# Use air for Go hot-reload (install if not present)
if ! command -v air &> /dev/null; then
    echo "Installing air for Go hot-reload..."
    go install github.com/cosmtrek/air@latest
fi

# Start air in the background
air --build.cmd "go build -o /tmp/aether-shield-server ./..." \
    --build.bin "/tmp/aether-shield-server" \
    --addr :8080 \
    --delay 1 \
    --build.exclude_dir "testdata,assets,templates,storage,public,node_modules" &

GO_SERVER_PID=$!
echo "Go server started with PID: $GO_SERVER_PID"

# Wait a moment for the server to start
echo "Waiting for Go server to start..."
sleep 3

# Start Next.js app with hot-reload
echo "Starting Next.js app with hot-reload..."
cd /app/app
pnpm dev

# Cleanup on exit
trap "kill $GO_SERVER_PID" EXIT
