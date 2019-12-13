FROM node:12-alpine as builder

RUN mkdir /var/app

WORKDIR /var/app

ADD package.json .

RUN yarn install

ADD . .

ENV NODE_ENV production
ENV BABEL_ENV production

RUN ./node_modules/.bin/babel src --out-dir www


FROM node:12-alpine

RUN mkdir /var/app

WORKDIR /var/app

RUN ls -la /var/app

COPY --from=builder /var/app/www/. .
COPY --from=builder /var/app/package.json .

ENV NODE_ENV production
RUN yarn install --prod

ENV PORT 80

EXPOSE 80

CMD ["node", "boot.js"]


