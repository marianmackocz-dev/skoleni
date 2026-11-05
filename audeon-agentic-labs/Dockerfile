FROM node:24.22.1-bookworm-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
USER node
CMD ["npm","run","gateway"]
