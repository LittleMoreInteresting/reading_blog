# ============================================================
# Build Docker image and push to Alibaba Cloud Container Registry
# Target: registry.cn-beijing.aliyuncs.com/mini-sys/reading-blog:latest
# ============================================================

$ErrorActionPreference = "Stop"

$Registry = "registry.cn-beijing.aliyuncs.com"
$Namespace = "mini-sys"
$ImageName = "reading-blog"
$Tag = "latest"
$FullImage = "${Registry}/${Namespace}/${ImageName}:${Tag}"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Building & Pushing Docker Image" -ForegroundColor Cyan
Write-Host "  Target: $FullImage" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Docker is available
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Error: docker is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Build image
Write-Host "[1/3] Building Docker image..." -ForegroundColor Yellow
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

docker build -f deploy/Dockerfile -t "${ImageName}:${Tag}" .

Write-Host "Build successful!" -ForegroundColor Green

# Tag image
Write-Host "[2/3] Tagging image..." -ForegroundColor Yellow
docker tag "${ImageName}:${Tag}" $FullImage
Write-Host "Tagged: $FullImage" -ForegroundColor Green

# Push image
Write-Host "[3/3] Pushing to registry..." -ForegroundColor Yellow
docker push $FullImage

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Push successful!" -ForegroundColor Green
Write-Host "  Image: $FullImage" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To deploy on server, run:"
Write-Host "  cd deploy; docker compose pull; docker compose up -d"
