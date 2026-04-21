#!/bin/bash
set -e

# --- SEO asset generation (pre-Vite) ---
# Regenerate test-level OG images if any are missing
if [ ! -f public/images/og-gsti.png ] || [ ! -f public/images/og-fpi.png ] || \
   [ ! -f public/images/og-fsi.png ] || [ ! -f public/images/og-mpi.png ] || \
   [ ! -f public/images/og-xpti.png ]; then
  node scripts/gen-og-images.mjs
fi

# Generate per-type OG images (idempotent — skips existing). Slow first run (~8min), free after.
npx tsx scripts/gen-og-types.mts

# 1. Type-check
npx tsc --noEmit

# 2. Build React app to temp directory
npx vite build --outDir dist-temp

# 2. Prepare final dist
rm -rf dist
mkdir -p dist

# 3. Copy main entry
cp dist-temp/index.html dist/index.html
cp -r dist-temp/assets dist/assets

# 5. Copy test builds into /new/<test>/
for test in sbti love work values cyber desire gsti fpi fsi mpi xpti mbti dogti cati; do
  mkdir -p dist/new/$test
  cp dist-temp/$test.html dist/new/$test/index.html
done

# 6. Copy hub landing page + PWA manifest
cp index.html dist/index.html
cp manifest.json dist/manifest.json

# 7. Copy shared static assets
cp -r images dist/images
test -f sw.js && cp sw.js dist/sw.js

# 7.5 Copy SEO root files (sitemap, robots) from Vite public/ output
[ -f dist-temp/sitemap.xml ] && cp dist-temp/sitemap.xml dist/sitemap.xml
[ -f dist-temp/robots.txt ] && cp dist-temp/robots.txt dist/robots.txt

# Copy any site-ownership verification txt files (e.g. ad/search-engine verification)
for f in dist-temp/*.txt; do
  [ -f "$f" ] && cp "$f" dist/
done

# Copy admin pages (funnel dashboard etc.)
if [ -d dist-temp/admin ]; then
  mkdir -p dist/admin
  cp -R dist-temp/admin/. dist/admin/
fi

# Merge generated OG images from public/images (dist-temp/images) into dist/images
# Recursive copy to pick up og-types/ subdirs; no-clobber to preserve repo /images/ originals
if [ -d dist-temp/images ]; then
  cp -n dist-temp/images/*.png dist/images/ 2>/dev/null || true
  for sub in dist-temp/images/*/; do
    if [ -d "$sub" ]; then
      name=$(basename "$sub")
      cp -R "$sub" "dist/images/$name"
    fi
  done
fi

# 7.6 Generate type pages + hub directly into dist/types/
npx tsx scripts/gen-type-pages.mts

# 7.7 Generate article pages + hub directly into dist/articles/
npx tsx scripts/gen-articles.mts

# 7.8 Regenerate sitemap now that type + article routes exist, copy final version
node scripts/gen-sitemap.mjs
cp public/sitemap.xml dist/sitemap.xml

# 8. Cleanup
rm -rf dist-temp

echo "Build complete: old at /, SBTI at /new/, love/work/values/cyber/desire/gsti/fpi/fsi/mpi/xpti/mbti at /new/<test>/, types at /types/"
