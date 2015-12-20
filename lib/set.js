'use strict';

var path = require('path');
var chalk = require('chalk');
var fs = require('hexo-fs');
var yml = require('js-yaml');

module.exports = function(config, key, val) {
  key = key.split('/');
  var len = key.length;
  if (len < 2) {
    return console.log('\n   [%s]仅能配置最终子项。\n', key);
  }

  _setConfig(config, key, val);

  return fs.writeFile(config.local.yml, yml.safeDump(config))
}

var _setConfig = function (config, key ,val) {
  
  if(typeof(config[key[0]]) ==  "undefined"){
    return console.log('\n  [%s]未定义此变量。\n', chalk.red(key.join('/')));
  }

  if (key.length > 1){
    _setConfig(config[key[0]], key.slice(1), val); 
  } else {
    if (typeof(config[key[0]]) !=  "string") {
      return console.log('\n   [%s]仅能配置最终子项。\n', key);
    }
    config[key[0]] = val;
  }
}