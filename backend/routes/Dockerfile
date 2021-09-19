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
COPY ./packages/routes ./packages/routes

RUN yarn install --pure-lockfile --non-interactive

RUN yarn --cwd packages/routes prisma:generate

RUN yarn --cwd packages/routes build

FROM node:12-alpine

RUN apk --no-cache add curl

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
COPY ./configs/tsconfig.base.json ./configs/
COPY packages/routes/package.json packages/routes/
# COPY packages/routes/.env* packages/routes/

COPY --from=build /usr/src/app/packages/routes/lib /usr/src/app/packages/routes/lib
COPY --from=build /usr/src/app/packages/routes/prisma /usr/src/app/packages/routes/prisma
COPY --from=build /usr/src/app/packages/routes/start.sh /usr/src/app/packages/routes/start.sh
COPY --from=build /usr/src/app/packages/routes/node_modules/@prisma/client/ /usr/src/app/packages/routes/node_modules/@prisma/client/
COPY --from=build /usr/src/app/packages/routes/node_modules/.prisma/client/ /usr/src/app/packages/routes/node_modules/.prisma/client/

# ENV NODE_ENV production

# RUN yarn install --pure-lockfile --non-interactive --production
RUN yarn install --pure-lockfile --non-interactive

WORKDIR /usr/src/app/packages/routes

EXPOSE 4001
EXPOSE 80

RUN chmod +x start.sh

HEALTHCHECK CMD curl --fail http://localhost:4001/.well-known/apollo/server-health || exit 1

ENTRYPOINT ["sh", "./start.sh"]
