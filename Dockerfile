FROM node:21

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV PORT=3001

ENV NODE_ENV=production

EXPOSE 3001

CMD [ "npm", "run", "start" ]