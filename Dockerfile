# Use official Node.js image
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm ci

# Bundle app source
COPY . .

# Build TypeScript
RUN npm run build

# Expose port (Cloud Run uses 8080 by default)
EXPOSE 8080

# Start command
CMD [ "npm", "start" ]
