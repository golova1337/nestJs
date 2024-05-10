FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY tsconfig.json .
COPY ./src ./src
RUN npm run build
EXPOSE 3000
CMD ["npm","run", "start"]
