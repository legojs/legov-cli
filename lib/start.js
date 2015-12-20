'use strict';

var path = require('path');
var chalk = require('chalk');
var fs = require('hexo-fs');

module.exports = function (config) {
  var server = path.join(config.local.path, 'node_modules', 'legov-server');
  
  return fs.exists(server).then(function (exist) {
    if (exist) {
      require(server).start(config);
    } else {
      console.log('[%s]当前目录下没有找到站点服务器。', chalk.red(server));
    }
  })
}