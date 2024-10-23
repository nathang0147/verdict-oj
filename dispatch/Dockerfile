FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install --only=development

COPY . .

RUN npm run build

CMD [ "npm", "run", "start" ]

FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY .env .env

RUN npm install --omit=dev

COPY src ./src

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 80

CMD [ "node", "dist/main" ]