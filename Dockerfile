# Check out https://hub.docker.com/_/node to select a new base image
FROM node:10-slim AS builder

# Set to a non-root built-in user `node`
#USER node

# Create app directory (with user `node`)
RUN mkdir -p /app/lb-client

WORKDIR /app/lb-client

ENV PATH /app/lb-client/node_modules/.bin:$PATH

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm install -g @angular/cli@

# Bundle app source code
COPY  . .

#RUN npm run build

#FROM nginx:alpine

#COPY --from=builder /home/node/ng/app/dist/* /usr/share/nginx/html/
CMD ng serve --host 0.0.0.0
