FROM node:16-slim

WORKDIR /app
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package.json .
RUN yarn install --production

COPY ./dist ./dist

CMD [ "yarn", "start"]