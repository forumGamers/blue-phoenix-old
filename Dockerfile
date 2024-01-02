FROM keymetrics/pm2:latest-alpine

WORKDIR /usr/local/app

COPY package.json package-lock.json /usr/local/app/

RUN npm install && npm cache clean --force

RUN npm install pm2 typescript -g

COPY ./ /usr/local/app/

RUN npm run build

CMD [ "pm2-runtime","start","ecosystem.config.js" ]