#!/bin/bash

mkdir lib

echo "lib directory created. Copying publish package.json"

node ./scripts/updateNpmPackageJson.js

cp package.npm.json lib/package.json

echo "copy complete"
