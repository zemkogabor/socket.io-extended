FROM node:18.4.0-alpine

ENV NODE_ENV production
ENV UV_THREADPOOL_SIZE 10

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --production

COPY src/ .

EXPOSE 3000

CMD ["yarn", "start"]
