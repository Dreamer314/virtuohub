#!/bin/bash

# VirtuoHub Essential Quality Checks
# Focuses on critical issues: TypeScript compilation and build verification

set -e  # Exit on any error

echo "🚀 Running VirtuoHub Essential Quality Checks..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ $1 passed${NC}"
  else
    echo -e "${RED}❌ $1 failed${NC}"
    exit 1
  fi
}

echo -e "${BLUE}📝 Step 1: TypeScript Compilation Check${NC}"
npx tsc --noEmit
print_status "TypeScript Check"
echo ""

echo -e "${BLUE}🏗️ Step 2: Production Build Test${NC}"
npm run build
print_status "Build Check"
echo ""

echo -e "${GREEN}🎉 Essential Quality Checks Passed!${NC}"
echo ""
echo "Your VirtuoHub code is:"
echo "✅ Type-safe (no TypeScript errors)"
echo "✅ Builds successfully for production"
echo ""
echo "Additional checks available:"
echo "  • Full lint check: ./scripts/check-all.sh"
echo "  • Format check: npx prettier --check ."
echo "  • Tests: npm test"