#!/bin/bash

echo "🔧 Criando rede..."
docker network create minha-rede

echo "📦 Criando volume..."
docker volume create postgres_data

echo "🐘 Subindo banco de dados..."
docker run -d --name db-rm565568 \
--network minha-rede \
-v postgres_data:/var/lib/postgresql/data \
-e POSTGRES_PASSWORD=postgres123 \
-e POSTGRES_DB=appdb \
-p 5432:5432 \
postgres:15

echo "⚙️ Build da API..."
docker build -t api-rm565568 .

echo "🚀 Subindo API..."
docker run -d --name app-rm565568 \
--network minha-rede \
-e DB_HOST=db-rm565568 \
-e DB_USER=postgres \
-e DB_PASSWORD=postgres123 \
-e DB_NAME=appdb \
-e DB_PORT=5432 \
-p 3000:3000 \
api-rm565568

echo "✅ Ambiente pronto!"