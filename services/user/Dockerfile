# services/auth/Dockerfile

FROM node:18-slim

# Install required dependencies (including openssl)
RUN apt-get update && apt-get install -y \
  openssl \
  libssl-dev \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Start the dev server
CMD ["npm", "run", "dev"]
