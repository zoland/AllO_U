#!/bin/bash

# Deploy script for AllO_G v1.2.0

echo "🚀 Deploying AllO_G v1.2.0..."

# Create version tag
VERSION="v1.2.0"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DEPLOY_DIR="deploy_${VERSION}_${TIMESTAMP}"

# Create deployment directory
mkdir -p $DEPLOY_DIR

# Copy all files
echo "📦 Copying files..."
cp -r index.html $DEPLOY_DIR/
cp -r css $DEPLOY_DIR/
cp -r js $DEPLOY_DIR/
cp -r manifest.json $DEPLOY_DIR/
cp -r sw.js $DEPLOY_DIR/

# Create info file
echo "📝 Creating deployment info..."
cat > $DEPLOY_DIR/deploy_info.txt << EOF
AllO_G Deployment
Version: $VERSION
Date: $(date)
Features:
- 4-button navigation with Locator
- My Profile with avatar support
- Dropdown menu
- Profile visibility settings
- Callsign uniqueness check
- Image compression service
EOF

# Create zip archive
echo "🗜️ Creating archive..."
zip -r "${DEPLOY_DIR}.zip" $DEPLOY_DIR

echo "✅ Deployment package ready: ${DEPLOY_DIR}.zip"
echo "📊 Total size: $(du -sh $DEPLOY_DIR | cut -f1)"

# Optional: Upload to server
# scp "${DEPLOY_DIR}.zip" user@server:/path/to/deployment/

echo "🎉 Deployment complete!"