'use strict';

var path = require('path');
var chalk = require('chalk');
var fs = require('hexo-fs');

module.exports = function(current) {
  var legov = path.join(current, '..', '@legov');
  var config = path.join(legov, 'legov.yml');
  var server = path.join(legov, 'node_modules', 'legov-server');
  fs.exists(server).then(function (exist) {
    if (exist) {
      var service = require(server);
      service.proxy(config);
    } else {
      console.log('[%s]未找到代理服务器。', chalk.red(server));
    }
  })
}