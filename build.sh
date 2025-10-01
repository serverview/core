#!/bin/bash

echo "Creating output directory..."
mkdir -p dist

echo "Building for Linux x64..."
bun build src/index.ts --compile --outfile dist/svh-x64 --target=bun-linux-x64

echo "Building for Linux ARM64..."
bun build src/index.ts --compile --outfile dist/svh-arm64 --target=bun-linux-arm64

echo "Build complete. Binaries are in the dist/ directory."
