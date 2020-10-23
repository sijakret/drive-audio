const path = require('path');
const base = require('./webpack.config.base')
const config = base('src');

module.exports = {
  ...config,
  entry: {
    'drive-audio': config.entry['drive-audio']
  },
  output: {
    path: path.resolve(__dirname, `dist`),
    filename: 'index.js'
  },
  plugins: []
}