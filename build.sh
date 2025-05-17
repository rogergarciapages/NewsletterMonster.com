#!/bin/bash

# Set Node memory settings
export NODE_OPTIONS="--max-old-space-size=4096"

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Build Next.js application
echo "Building Next.js application..."
npx next build

echo "Build completed successfully!" 