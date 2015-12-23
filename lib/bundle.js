'use strict';

var path = require('path');
var chalk = require('chalk');
var fs = require('hexo-fs');

module.exports = function (config) {
  var bundler = path.join(config.local.path, 'node_modules', 'legov-bundler');
  return fs.exists(bundler).then(function (exist) {
    if (exist) {
      require(bundler)(config);
    } else {
      console.log('[%s]当前目录下没有找到legov-bundler。', chalk.red(server));
    }
  })
}