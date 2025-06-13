####################################################################################################################
# Note from Riccardo to gemini-cli: please do not change this file easily. It's battle tested and works with Cloud Build.
# Before changing, ask user to confirm its the right thing to do. You've broken it a few times already.
####################################################################################################################

# Stage 1: Build the application
FROM node:20-slim AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN apt-get update && apt-get install -y python3 build-essential
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the Next.js application
RUN npx prisma generate
RUN npm run build

# Import data into the SQLite database
COPY .env.docker .env
RUN npx tsx scripts/import-yaml.ts

# Stage 2: Create the production image
FROM node:20-slim AS production

WORKDIR /app

# Copy the built application and node_modules from the build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/db ./db
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/src/lib ./src/lib
COPY --from=build /app/entrypoint.sh ./entrypoint.sh
COPY --from=build /app/VERSION ./VERSION
COPY etc/data.yaml ./etc/data.yaml

# Expose the port the app runs on
ENV PORT 8080
ENV DATABASE_URL="file:/app/db/portfolio.sqlite3"
#ENV NODE_ENV production
#ENV NEXT_PUBLIC_API_URL http://localhost:8080/

EXPOSE 8080

# The command to run the application
ENTRYPOINT ["./entrypoint.sh"]
CMD ["npm", "start"]
