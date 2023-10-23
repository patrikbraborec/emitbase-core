FROM node:18

ENV NODE_ENV production
USER node

WORKDIR /app

COPY . .

RUN npm install @emitbase/emitbase-core@0.1.1

CMD [ "npx", "emitbase-core", "./" ]