#!/bin/bash

# VirtuoHub Quality Assurance Check Script
# This script runs all quality checks: typecheck, lint, format check, tests, and build

# Run all checks and collect results
TYPECHECK_PASSED=0
LINT_PASSED=0
FORMAT_PASSED=0
TESTS_PASSED=0
BUILD_PASSED=0

echo "🚀 Running VirtuoHub Quality Assurance Checks..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to run check and record result
run_check() {
  local check_name=$1
  local command=$2
  local result_var=$3
  
  echo -e "${BLUE}$check_name${NC}"
  if eval $command; then
    echo -e "${GREEN}✅ $1 passed${NC}"
    eval $result_var=1
  else
    echo -e "${RED}❌ $1 failed${NC}"
    eval $result_var=0
  fi
  echo ""
}

run_check "📝 Step 1: TypeScript Compilation Check" "npx tsc --noEmit" TYPECHECK_PASSED

run_check "🔍 Step 2: ESLint Code Quality Check" "npx eslint client/src server shared --ext .ts,.tsx,.js,.jsx --max-warnings 50" LINT_PASSED

run_check "💅 Step 3: Prettier Format Check" "npx prettier --check ." FORMAT_PASSED

run_check "🧪 Step 4: Playwright Tests" "npx playwright test --reporter=list" TESTS_PASSED

run_check "🏗️ Step 5: Production Build Test" "npm run build" BUILD_PASSED

# Final results
echo "📊 Quality Assurance Results:"
echo "================================"
[ $TYPECHECK_PASSED -eq 1 ] && echo -e "${GREEN}✅ TypeScript Check${NC}" || echo -e "${RED}❌ TypeScript Check${NC}"
[ $LINT_PASSED -eq 1 ] && echo -e "${GREEN}✅ ESLint Check${NC}" || echo -e "${RED}❌ ESLint Check${NC}"
[ $FORMAT_PASSED -eq 1 ] && echo -e "${GREEN}✅ Format Check${NC}" || echo -e "${RED}❌ Format Check${NC}"
[ $TESTS_PASSED -eq 1 ] && echo -e "${GREEN}✅ Test Suite${NC}" || echo -e "${RED}❌ Test Suite${NC}"
[ $BUILD_PASSED -eq 1 ] && echo -e "${GREEN}✅ Build Check${NC}" || echo -e "${RED}❌ Build Check${NC}"
echo ""

TOTAL_PASSED=$(($TYPECHECK_PASSED + $LINT_PASSED + $FORMAT_PASSED + $TESTS_PASSED + $BUILD_PASSED))

if [ $TOTAL_PASSED -eq 5 ]; then
  echo -e "${GREEN}🎉 All Quality Assurance Checks Passed! (5/5)${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠️ Some Quality Checks Failed ($TOTAL_PASSED/5 passed)${NC}"
  exit 1
fi
echo ""
echo "Your VirtuoHub code is:"
echo "✅ Type-safe"
echo "✅ Properly formatted"
echo "✅ Following code standards"
echo "✅ Ready for production"
echo ""
echo "You can also run individual checks:"
echo "  • TypeScript: npx tsc --noEmit"
echo "  • Linting: npx eslint client/src --ext .ts,.tsx --max-warnings 0"
echo "  • Formatting: npx prettier --check ."
echo "  • Build: npm run build"