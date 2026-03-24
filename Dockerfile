FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
COPY backend/package*.json ./backend/
RUN npm ci --workspace=backend

COPY backend/ ./backend/

EXPOSE 3001

CMD ["npm", "run", "dev", "--workspace=backend"]
