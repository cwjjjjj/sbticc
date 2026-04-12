#!/bin/bash
set -e

# 1. Type-check
npx tsc --noEmit

# 2. Build React app to temp directory
npx vite build --outDir dist-temp

# 3. Prepare final dist directory
rm -rf dist
mkdir -p dist/new

# 4. Copy React build into /new/
# Vite outputs: dist-temp/new.html and dist-temp/assets/
cp dist-temp/new.html dist/new/index.html
cp -r dist-temp/assets dist/new/assets

# 5. Copy old version to dist root
cp index.html dist/index.html
cp main.js dist/main.js
cp main.css dist/main.css

# 6. Copy shared static assets
cp -r images dist/images
test -f sw.js && cp sw.js dist/sw.js

# 7. Cleanup
rm -rf dist-temp

echo "Build complete: old version at /, new version at /new/"
