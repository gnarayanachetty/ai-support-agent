# API Gateway

## Overview

This service acts as the API Gateway for the AI Support Agent platform. It routes incoming requests to the appropriate microservices and serves unified OpenAPI documentation.

## Features

- Centralized routing to backend microservices
- Unified OpenAPI documentation
- Centralized authentication and authorization (if implemented)
- Request aggregation and response formatting

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

The gateway exposes endpoints that proxy or aggregate requests to underlying microservices. Common endpoints might include:

- `/api/chat` → Forwards to Chat Service
- `/api/user` → Forwards to User Service
- `/api/logs` → Forwards to Log Service
- `/openapi.json` or `/docs` → Serves unified OpenAPI documentation

> See each microservice for detailed endpoint documentation.

## Environment Variables

- `PORT`: Port for the gateway to listen on
- `SERVICE_CHAT_URL`: URL for the Chat Service
- `SERVICE_USER_URL`: URL for the User Service
- `JWT_SECRET`: JWT secret key (if authentication is handled here)

## Docker

```bash
docker build -t gateway-service .
docker run -d -p 4000:4000 --name gateway-service gateway-service
```

## License

MIT License
