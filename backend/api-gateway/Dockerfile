# Run with a build context at the root of the project
# docker build -f packages/server/Dockerfile .
# Use a multi-stage build to reduce the final image size
# ~1GB -> ~400MB
# https://docs.docker.com/develop/develop-images/multistage-build/
FROM node:12-alpine as build

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
COPY ./configs/tsconfig.base.json ./configs/
COPY ./packages/api-gateway ./packages/api-gateway

RUN yarn install --pure-lockfile --non-interactive

RUN yarn --cwd packages/api-gateway build

FROM node:12-alpine

RUN apk --no-cache add curl

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
COPY ./configs/tsconfig.base.json ./configs/
COPY packages/api-gateway/package.json packages/api-gateway/
# COPY packages/api-gateway/.env* packages/api-gateway/

COPY --from=build /usr/src/app/packages/api-gateway/lib /usr/src/app/packages/api-gateway/lib

# ENV NODE_ENV production

# RUN yarn install --pure-lockfile --non-interactive --production
RUN yarn install --pure-lockfile --non-interactive

WORKDIR /usr/src/app/packages/api-gateway

EXPOSE 4000
EXPOSE 80

HEALTHCHECK CMD curl --fail http://localhost:4000/.well-known/apollo/server-health || exit 1

CMD ["yarn", "start"]
