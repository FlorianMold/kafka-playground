FROM gmolaire/yarn:1.22.4_14.6.0
MAINTAINER Florian Mold <florian.mold@live.at>

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 8080
CMD [ "node", "index.js" ]
