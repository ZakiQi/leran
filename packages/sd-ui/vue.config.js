const path = require('path');

function resolve(dir) {
  return path.resolve(__dirname, dir)
}

const NODE_ENV = process.env.NODE_ENV
console.log(NODE_ENV, 'NODE_ENV')

module.exports = {
  pages: {
    index: {
      entry: 'examples/main.js',
      template: "public/index.html",
      filename: "index.html"
    }
  }
}