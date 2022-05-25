# pull official base image
FROM node:16-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json package-lock.json ./
# skips checks for discrepancy between the lock file and the package.json
RUN npm ci

# start app (already in docker-compose.yml)
#CMD ["npm", "start"]
