# Stage 1: Build the application
FROM node:20-slim AS build

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Create the production image
FROM node:20-slim AS production

# Set the working directory
WORKDIR /app

# Copy the built application from the build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

# Expose the port the app runs on
EXPOSE 8080

# The command to run the application
CMD ["npm", "start"]