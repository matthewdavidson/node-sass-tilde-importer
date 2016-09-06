# node-sass-tilde-importer

> A node-sass custom importer which turns ~ into absolute paths to the nearest parent node_modules directory.

## Install

```sh
npm install node-sass-tilde-importer --save-dev
```

## Usage

### Using the node-sass cli

```sh
node-sass style.scss --importer=node_modules/node-sass-tilde-importer
```
