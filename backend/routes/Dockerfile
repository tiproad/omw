# Run with a build context at the root of the project
# docker build -f backend/server/Dockerfile .
# Use a multi-stage build to reduce the final image size
# ~1GB -> ~400MB
# https://docs.docker.com/develop/develop-images/multistage-build/
FROM node:12-alpine

RUN apk --no-cache add curl

WORKDIR /usr/src/app

COPY ./backend/routes .

# ENV NODE_ENV production

# RUN yarn install --pure-lockfile --non-interactive --production
RUN yarn install --pure-lockfile --non-interactive

RUN yarn prisma:generate

RUN yarn build

EXPOSE 4001
EXPOSE 80

RUN chmod +x start.sh

HEALTHCHECK CMD curl --fail http://localhost:4001/.well-known/apollo/server-health || exit 1

ENTRYPOINT ["sh", "./start.sh"]
