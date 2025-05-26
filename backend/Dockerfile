FROM node:16-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:16-alpine

WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm install --only=production --legacy-peer-deps

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose the port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/main"]
