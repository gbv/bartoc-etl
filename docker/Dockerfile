# Base Image with node
FROM node:23-alpine

# Working directory
WORKDIR /usr/src/app

# Copy config files and dependencies
COPY package*.json tsconfig.json ./
COPY nodemon.json ./

# Install dependencies (included dev dependencies)
RUN npm ci

# Copy all the source code
COPY . .

# Expose to port 3000
EXPOSE 3000

# Command to run
CMD ["npm", "run" , "dev"]
