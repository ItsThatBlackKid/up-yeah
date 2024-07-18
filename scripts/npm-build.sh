#!/bin/bash

mkdir lib

echo "lib directory created. Copying publish package.json"

node ./scripts/updateNpmPackageJson.js

cp package.npm.json lib/package.json # copy package json made for NPM
cp README.md lib/readme.md # copy README

echo "copy complete"
