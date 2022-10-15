
FROM heroku/heroku:25-alpine
ADD ./.profile.d /app/.profile.d
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
FROM node:16
# Create app directory
WORKDIR /usr/src/medpass-api-prod

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY .env ./

RUN npm install
# If you are building your code for production
RUN npm ci --only=production
# Bundle app source
COPY . .
RUN tsc
EXPOSE $PORT
CMD [ "npm", "run","start" ]

