import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Proxy config (example URLs, adjust as needed)
const CHAT_SERVICE_URL = process.env.SERVICE_CHAT_URL || 'http://localhost:4003';
const USER_SERVICE_URL = process.env.SERVICE_USER_URL || 'http://localhost:4001';

// Proxy routes
app.use('/api/chat', createProxyMiddleware({ target: CHAT_SERVICE_URL, changeOrigin: true }));
app.use('/api/user', createProxyMiddleware({ target: USER_SERVICE_URL, changeOrigin: true }));

// Serve unified OpenAPI docs if available
const openapiPath = path.join(__dirname, '../openapi/openapi.json');
if (fs.existsSync(openapiPath)) {
  const openapiSpec = JSON.parse(fs.readFileSync(openapiPath, 'utf-8'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
  app.get('/openapi.json', (_req, res) => res.json(openapiSpec));
}

app.get('/', (_req, res) => {
  res.send('AI Support Agent API Gateway is running.');
});

app.listen(PORT, () => {
  console.log(`Gateway listening on port ${PORT}`);
});
