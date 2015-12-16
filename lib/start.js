'use strict';

var path = require('path');
var chalk = require('chalk');
var fs = require('hexo-fs');

module.exports = function(current) {
  var config = path.join(current, 'legov.yml');
  var legov = path.join(current, '..', '@legov');
  var server = path.join(legov, 'node_modules', 'legov-server');
  fs.exists(server).then(function (exist) {
    if (exist) {
      var service = require(server);
      service.start(config, legov);
    } else {
      console.log('[%s]当前目录下没有找到站点服务器。', chalk.red(server));
    }
  })
}