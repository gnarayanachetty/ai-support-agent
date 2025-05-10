# Chat Service

## Overview

This service handles chat sessions, logs, and query routing.

## Features

- Chat session management
- Query routing
- Log management

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

### Chat

- POST /chat
  - Body: { "message": "<user message>" }
  - Response: { "message": "<assistant response>" }

### Query

- POST /query
  - Body: { "query": "<query>" }
  - Response: { "answer": "<answer>" }

### Logs

- GET /logs
  - Response: [ { "id": "<log id>", "message": "<message>", "timestamp": "<timestamp>" } ]

### Session

- GET /session
  - Response: { "id": "<session id>" }

- POST /session
  - Response: { "id": "<session id>" }

- DELETE /session
  - Response: { "id": "<session id>" }              

## Environment Variables

- DATABASE_URL: Database connection string
- JWT_SECRET: JWT secret key

## Docker

```bash
docker build -t chat-service .
docker run -d -p 4003:4003 --name chat-service chat-service
```

## License

MIT License




