#!/bin/bash
chmod +x scripts/npm-build.sh

yarn install --frozen-lockfile
yarn build

cd lib
npm pack 