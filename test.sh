#!/bin/bash

# Set environment variables for the server
export PORT="8080"
export BASE_PATH="$(pwd)/tmp"
export INDEX_FILES="index.svh,index.html"

# Log the settings
echo "Starting server with the following settings:"
echo "PORT: $PORT"
echo "BASE_PATH: $BASE_PATH"
echo "INDEX_FILES: $INDEX_FILES"
echo "---"

# Run the server from the built binary
./dist/svh-x64
