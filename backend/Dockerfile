FROM node:22-alpine AS base

# Install curl for healthcheck
RUN apk add --no-cache curl

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=5001

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy source code
COPY src ./src

# Create uploads directory with appropriate permissions
RUN mkdir -p /app/uploads && chown -R node:node /app

# Switch to non-root user for security
USER node

EXPOSE 5001

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5001/api/health || exit 1

CMD ["node", "src/server.js"]
