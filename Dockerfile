# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:slim as base
WORKDIR /usr/src/app

# install dependencies
FROM base as dependencies
COPY package.json .
COPY bun.lockb .
COPY tsconfig.json .
RUN bun i --production
RUN bun run build

FROM dependencies as release
COPY . .
# run the app
USER bun
CMD [ "bun", "run", "start" ]