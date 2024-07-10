const jsonFile = require('../package.npm.json')
const mainPackageJson = require('../package.json')
const fs = require('fs');


const updateFile = JSON.stringify({
    ...jsonFile,
    version: mainPackageJson.version
});

console.log(updateFile);

fs.writeFileSync('package.npm.json', updateFile, 'utf8');