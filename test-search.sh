#!/bin/bash

# Test Search Functionality

echo "🔍 Testing Search Functionality..."
echo ""

# Test 1: API with non-existent keyword
echo "Test 1: Search 'xyz123abc' (should return 0 results)"
RESULT=$(curl -s "http://localhost:3000/api/products/search?keyword=xyz123abc" | jq '.data | length')
echo "API Result: $RESULT products"
if [ "$RESULT" = "0" ]; then
  echo "✅ PASS - API filters correctly"
else
  echo "❌ FAIL - API should return 0, got $RESULT"
fi
echo ""

# Test 2: API with existing keyword
echo "Test 2: Search 'iPhone' (should return > 0 results)"
RESULT=$(curl -s "http://localhost:3000/api/products/search?keyword=iPhone" | jq '.data | length')
echo "API Result: $RESULT products"
if [ "$RESULT" -gt "0" ]; then
  echo "✅ PASS - API returns matching results"
else
  echo "❌ FAIL - API should return products, got $RESULT"
fi
echo ""

# Test 3: Check HTML page renders
echo "Test 3: Check /search page loads"
RESULT=$(curl -s "http://localhost:3000/search?keyword=test" | grep "search-results-container" | wc -l)
if [ "$RESULT" -gt "0" ]; then
  echo "✅ PASS - /search page renders correctly"
else
  echo "❌ FAIL - /search page missing container"
fi
echo ""

# Test 4: Empty search
echo "Test 4: Search with empty keyword"
RESULT=$(curl -s "http://localhost:3000/api/products/search?keyword=" | jq '.data | length')
echo "API Result: $RESULT products"
if [ "$RESULT" = "0" ]; then
  echo "✅ PASS - Empty search returns no results"
else
  echo "❌ FAIL - Empty search should return 0"
fi

echo ""
echo "🎉 Testing Complete!"
