#!/bin/sh

yarn prisma:migrate --skip-generate
yarn start