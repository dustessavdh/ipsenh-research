FROM node:16-alpine
WORKDIR /usr/app

ENV CSV_FILE=./data/docker.csv
COPY . .

RUN  npm ci
RUN npx tsc
RUN npm run build

ENTRYPOINT ["npm", "run", "start:build"]
