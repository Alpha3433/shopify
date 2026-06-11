#!/usr/bin/env sh
# Builds dist/old-glory-theme.zip — ready to upload via
# Shopify Admin → Online Store → Themes → Add theme → Upload zip file.
set -e
cd "$(dirname "$0")"
mkdir -p dist
rm -f dist/old-glory-theme.zip
zip -r dist/old-glory-theme.zip assets config layout locales sections snippets templates -x "*.DS_Store"
echo "Built dist/old-glory-theme.zip"
