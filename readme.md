# node-sass-tilde-importer

> A node-sass custom importer which turns ~ into absolute paths to the nearest parent node_modules directory.

## Install

```sh
npm install node-sass-tilde-importer --save-dev
```

## Usage

### Using the node-sass cli

```sh
node-sass src/style.scss dest/style.css --importer=./node_modules/node-sass-tilde-importer/index.js
```
