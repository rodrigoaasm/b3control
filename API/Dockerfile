FROM node:18-alpine3.15 as buider
## Builder container
WORKDIR /app/b3control/api

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY src/ src/
COPY .env .env
COPY tsconfig.json tsconfig.json

RUN npm run build

## JS Application container
FROM node:18-alpine3.15

WORKDIR /app/b3control/api

COPY --from=buider /app/b3control/api/dist dist
COPY --from=buider /app/b3control/api/package.json package.json
COPY --from=buider /app/b3control/api/package-lock.json package-lock.json

RUN npm install --omit=dev

EXPOSE 4000

CMD ["npm", "run", "start"]