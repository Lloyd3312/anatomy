# Use Node.js 24 because the application requires Node >= 22.13
FROM node:24-alpine

# Create the application working directory
WORKDIR /app

# Copy dependency files first
COPY package.json package-lock.json ./

# Install exact dependency versions
RUN npm ci

# Copy the application source code
COPY . .

# Build the production application
RUN npm run build

# Vinext production server listens on port 3000
EXPOSE 3000

# Start the production application
CMD ["npm", "start"]