FROM node:14.14.0-alpine
WORKDIR "/app"

COPY ./package.json ./
RUN npm install
COPY ./ ./
RUN npm run build
COPY ./ ./

EXPOSE 8080
CMD [ "npm", "start" ]