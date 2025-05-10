# services/knowledge-base/Dockerfile

FROM node:18-slim

# Install required dependencies (including openssl)
RUN apt-get update && apt-get install -y \
  openssl \
  libssl-dev \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
CMD ["npm", "run", "dev"]
