#!/bin/bash
set -e

# 1. Build React app to temp directory
npx vite build --outDir dist-temp

# 2. Prepare final dist
rm -rf dist
mkdir -p dist

# 3. Copy main entry
cp dist-temp/index.html dist/index.html
cp -r dist-temp/assets dist/assets

# 4. Copy test entry points into subfolders
for test in love work values cyber; do
  mkdir -p dist/$test
  cp dist-temp/$test.html dist/$test/index.html
done

# 5. Copy static assets
cp -r images dist/images
test -f sw.js && cp sw.js dist/sw.js

# 6. Cleanup
rm -rf dist-temp

echo "Build complete: SBTI at /, tests at /<test>/"
