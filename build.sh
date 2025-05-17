#!/bin/bash
# Set memory limit for Node.js
export NODE_OPTIONS="--max-old-space-size=4096 --no-deprecation"

# Run the build process
npm run clean
npx prisma generate
next build

echo "Build completed successfully!" 