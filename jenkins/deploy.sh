#!/bin/bash
APP_NAME=estoque-toner
IMAGE_NAME=geolab/estoque-toner:latest
CONTAINER_NAME=estoque-toner

# Build da imagem
docker build -t $IMAGE_NAME .

# Para o container antigo, se houver
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

# Sobe o novo container
docker run -d \
  --name $CONTAINER_NAME \
  --restart always \
  -p 3000:3000 \
  $IMAGE_NAME
#!/bin/bash
APP_NAME=estoque-toner
IMAGE_NAME=geolab/estoque-toner:latest
CONTAINER_NAME=estoque-toner

# Build da imagem
docker build -t $IMAGE_NAME .

# Para o container antigo, se houver
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

# Sobe o novo container
docker run -d \
  --name $CONTAINER_NAME \
  --restart always \
  -p 3000:3000 \
  $IMAGE_NAME
