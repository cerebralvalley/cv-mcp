FROM oven/bun:1-alpine

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile --production

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Expose port
EXPOSE 8000

# Run the HTTP server
CMD ["bun", "run", "src/http-server.ts"]
