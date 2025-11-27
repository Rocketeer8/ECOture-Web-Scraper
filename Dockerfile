# Backend container for the scraper API (Playwright + Node).
FROM mcr.microsoft.com/playwright:v1.57.0-jammy

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source
COPY . .

ENV PORT=5000
EXPOSE 5000

# Start the server
CMD ["node", "server/server.js"]
