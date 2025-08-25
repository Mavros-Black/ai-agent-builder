#!/bin/bash

# Create Admin User Script
# This script creates admin test users for the AI Agent Builder

echo "🔧 AI Agent Builder - Admin User Creator"
echo "========================================"

# Default values
EMAIL=${1:-"mavros.black@yahoo.com"}
PASSWORD=${2:-"Monster123"}
ROLE=${3:-"enterprise"}
BASE_URL=${4:-"http://localhost:3000"}

echo "📧 Email: $EMAIL"
echo "🔑 Password: $PASSWORD"
echo "👑 Plan: $ROLE"
echo "🌐 Base URL: $BASE_URL"
echo ""

# Check if server is running
echo "🔍 Checking if server is running..."
if curl -s "$BASE_URL" > /dev/null; then
    echo "✅ Server is running"
else
    echo "❌ Server is not running at $BASE_URL"
    echo "💡 Please start the server with: npm run dev"
    exit 1
fi

# Create admin user
echo ""
echo "🚀 Creating admin user..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/admin/create-user" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"role\": \"$ROLE\"
  }")

# Check if the request was successful
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "✅ Admin user created successfully!"
    echo ""
    echo "🎉 Login Credentials:"
    echo "📧 Email: $EMAIL"
    echo "🔑 Password: $PASSWORD"
    echo "👑 Plan: $ROLE"
    echo ""
    echo "🔗 Login URL: $BASE_URL/auth/login"
    echo ""
    echo "📋 Quick copy-paste:"
    echo "$EMAIL / $PASSWORD"
else
    echo "❌ Failed to create admin user"
    echo "Response: $RESPONSE"
    exit 1
fi

echo ""
echo "🎯 Next steps:"
echo "1. Visit: $BASE_URL/auth/login"
echo "2. Login with the credentials above"
echo "3. Test all features with enterprise access"
echo "4. Visit: $BASE_URL/admin for more admin tools"
