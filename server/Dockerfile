# Build Stage
FROM node:20-alpine as build
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production Stage
FROM node:20-alpine as production
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --only=production

# Copy built application
COPY --from=build /app/dist ./dist

# Create temp directory for file uploads
RUN mkdir -p temp

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "dist/app.js"]
