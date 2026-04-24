#!/bin/bash
set -e

# ============================================================
# Build Docker image and push to Alibaba Cloud Container Registry
# Target: registry.cn-beijing.aliyuncs.com/mini-sys/reading-blog:latest
# ============================================================

REGISTRY="registry.cn-beijing.aliyuncs.com"
NAMESPACE="mini-sys"
IMAGE_NAME="reading-blog"
TAG="latest"
FULL_IMAGE="${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}:${TAG}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "  Building & Pushing Docker Image"
echo "  Target: ${FULL_IMAGE}"
echo "========================================"
echo ""

# Check Docker is available
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: docker is not installed or not in PATH${NC}"
    exit 1
fi

# Check if logged into Alibaba Cloud registry
echo -e "${YELLOW}[1/4] Checking registry login status...${NC}"
if ! docker info 2>/dev/null | grep -q "Registry"; then
    echo -e "${YELLOW}Please login to Alibaba Cloud registry first:${NC}"
    echo "  docker login ${REGISTRY}"
    exit 1
fi

# Build image
echo -e "${YELLOW}[2/4] Building Docker image...${NC}"
cd "$(dirname "$0")/.."
docker build \
    -f deploy/Dockerfile \
    -t "${IMAGE_NAME}:${TAG}" \
    .

echo -e "${GREEN}Build successful!${NC}"

# Tag image
echo -e "${YELLOW}[3/4] Tagging image...${NC}"
docker tag "${IMAGE_NAME}:${TAG}" "${FULL_IMAGE}"
echo -e "${GREEN}Tagged: ${FULL_IMAGE}${NC}"

# Push image
echo -e "${YELLOW}[4/4] Pushing to registry...${NC}"
docker push "${FULL_IMAGE}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Push successful!${NC}"
echo -e "${GREEN}  Image: ${FULL_IMAGE}${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "To deploy on server, run:"
echo "  cd deploy && docker compose pull && docker compose up -d"
