# --- Build Stage ---
# Use an official Node.js image to build the React application
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
# This is done separately to leverage Docker's layer caching
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy all the project files into the container
COPY . .

# Run the build command with an increased memory limit
# This prevents the "JavaScript heap out of memory" error for large projects
RUN NODE_OPTIONS=--max-old-space-size=4096 npm run build

# --- Production Stage ---
# Use a lightweight Nginx image to serve the built static files
FROM nginx:alpine

# Copy the built production files from the 'build' stage to the Nginx server directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# The Nginx server starts automatically
CMD ["nginx", "-g", "daemon off;"]
