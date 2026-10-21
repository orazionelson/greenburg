#!/usr/bin/env node
/* Copies the package.json version into index.html (?v= on every script and
 * stylesheet) and js/config.js (used for image URLs), so that after a release
 * browsers download the new files instead of reusing cached ones.
 * `npm version patch|minor` runs it automatically. */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const { version } = require(path.join(root, 'package.json'));

const indexPath = path.join(root, 'index.html');
const index = fs.readFileSync(indexPath, 'utf8')
  .replace(/((?:src|href)="(?:js|css)\/[^"?]+)(?:\?v=[^"]*)?"/g, `$1?v=${version}"`);
fs.writeFileSync(indexPath, index);

const configPath = path.join(root, 'js', 'config.js');
const config = fs.readFileSync(configPath, 'utf8')
  .replace(/version: '[^']*'/, `version: '${version}'`);
fs.writeFileSync(configPath, config);

console.log('Version set to', version);
