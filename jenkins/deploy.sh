#!/bin/bash
APP_NAME=estoque-toner
IMAGE_NAME=geolab/estoque-toner:latest
CONTAINER_NAME=estoque-toner

echo "[Deploy] Construindo nova imagem..."
docker build -t $IMAGE_NAME .

echo "[Deploy] Parando e removendo container antigo, se existir..."
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

echo "[Deploy] Subindo container novo..."
docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p 3000:3000 \
  $IMAGE_NAME
