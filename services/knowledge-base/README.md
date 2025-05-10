# Knowledge Base Service

## Overview 

This service manages support articles and embeddings for semantic search.

## Features

- Article management
- Embedding generation
- Semantic search

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

3. Run the service:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Start the service:
   ```bash
   npm run start
   ```

## API

### Articles

- GET /articles
  - Response: [ { "id": "<article id>", "title": "<article title>", "content": "<article content>" } ]

- POST /articles
  - Body: { "title": "<article title>", "content": "<article content>" }
  - Response: { "id": "<article id>" }

- GET /articles/:id
  - Response: { "id": "<article id>", "title": "<article title>", "content": "<article content>" }

- PUT /articles/:id
  - Body: { "title": "<article title>", "content": "<article content>" }
  - Response: { "id": "<article id>" }

- DELETE /articles/:id
  - Response: { "id": "<article id>" }

### Embeddings

- POST /embeddings
  - Body: { "text": "<text to embed>" }
  - Response: { "id": "<embedding id>", "text": "<text to embed>", "embedding": "<embedding>" }

### Search

- POST /search
  - Body: { "query": "<search query>" }
  - Response: [ { "id": "<article id>", "title": "<article title>", "content": "<article content>" } ]

## Environment Variables

- DATABASE_URL: Database connection string
- JWT_SECRET: JWT secret key

## Docker

```bash
docker build -t knowledge-base-service .
docker run -d -p 4004:4004 --name knowledge-base-service knowledge-base-service
```

## License

MIT License 



