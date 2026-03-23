#!/bin/sh
set -eu

docker run --rm \
  --ipc=host \
  -v "$PWD":/work \
  -v paylinkops_node_modules_linux:/work/node_modules \
  -w /work \
  -e CI=1 \
  mcr.microsoft.com/playwright:v1.58.2-jammy \
  bash -lc 'npm ci && npm run test:e2e'
