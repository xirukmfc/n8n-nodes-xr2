#!/bin/bash

# Package testing script for n8n-nodes-xr2
# This script helps verify the package is ready for publishing

set -e

echo "🔍 Testing n8n-nodes-xr2 package..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Run this script from the n8n SDK directory.${NC}"
    exit 1
fi

# Test 1: Check package.json
echo "📋 Checking package.json..."
if grep -q "n8n-community-node" package.json; then
    echo -e "${GREEN}✓ Found n8n-community-node keyword${NC}"
else
    echo -e "${RED}✗ Missing n8n-community-node keyword${NC}"
    exit 1
fi

# Test 2: Clean build
echo ""
echo "🧹 Cleaning previous build..."
npm run clean

# Test 3: Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Test 4: Build
echo ""
echo "🔨 Building package..."
npm run build

# Test 5: Check dist files
echo ""
echo "📂 Checking dist files..."
required_files=(
    "dist/credentials/XR2Api.credentials.js"
    "dist/nodes/XR2/XR2.node.js"
    "dist/helpers/http.js"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ Found $file${NC}"
    else
        echo -e "${RED}✗ Missing $file${NC}"
        exit 1
    fi
done

# Test 6: Check icon
echo ""
echo "🎨 Checking icon..."
if [ -f "src/nodes/XR2/xr2.svg" ]; then
    echo -e "${GREEN}✓ Icon file exists${NC}"
else
    echo -e "${YELLOW}⚠ Icon file not found (optional but recommended)${NC}"
fi

# Test 7: Dry run pack
echo ""
echo "📦 Testing package creation (dry run)..."
npm pack --dry-run > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Package can be created${NC}"
else
    echo -e "${RED}✗ Package creation failed${NC}"
    exit 1
fi

# Test 8: Check documentation
echo ""
echo "📚 Checking documentation..."
docs=(
    "README.md"
    "TESTING.md"
    "PUBLISHING.md"
)

for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✓ Found $doc${NC}"
    else
        echo -e "${YELLOW}⚠ Missing $doc${NC}"
    fi
done

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ All tests passed!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "1. Test locally with: npm link"
echo "2. Test in n8n instance (see TESTING.md)"
echo "3. Publish with: npm publish (see PUBLISHING.md)"
echo ""
