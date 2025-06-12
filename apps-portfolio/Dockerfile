# Use the official Node.js 20 image as a base.
FROM node:20-slim

# Set the working directory in the container.
WORKDIR /app

# Install dependencies.
COPY package.json ./
COPY package-lock.json ./
RUN npm install --include=dev

# Copy the rest of the application's code.
COPY . .

# Build the Next.js application.
RUN npm run build

# Expose the port the app runs on.
EXPOSE 8080

# The command to run the application.
CMD ["npm", "start"]
