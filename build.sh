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
# Vite outputs: dist-temp/new.html, dist-temp/love.html, and dist-temp/assets/
cp dist-temp/new.html dist/new/index.html
cp -r dist-temp/assets dist/new/assets

# 5. Copy test builds into /new/<test>/
for test in love work values cyber; do
  mkdir -p dist/new/$test
  cp dist-temp/$test.html dist/new/$test/index.html
done

# 6. Copy old version to dist root
cp index.html dist/index.html
cp main.js dist/main.js
cp main.css dist/main.css

# 7. Copy shared static assets
cp -r images dist/images
test -f sw.js && cp sw.js dist/sw.js

# 8. Cleanup
rm -rf dist-temp

echo "Build complete: old at /, SBTI at /new/, love/work/values/cyber at /new/<test>/"
