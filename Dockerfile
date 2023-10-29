FROM node:16-slim

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
COPY . .

EXPOSE 8090

RUN npm install
RUN npm run build
CMD ["npm", "run", "preview"]
