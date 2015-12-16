'use strict';

var path = require('path');
var chalk = require('chalk');
var fs = require('hexo-fs');
var asset = path.join(__dirname, '../asset');

module.exports = function(current) {
  var legov = path.join(current, '@legov');

  if (fs.existsSync(legov)) {
    return console.log('\n  [%s]当前目录已初始化为工程目录。', chalk.green(current));
  }

  console.log('\n  拷贝文件到：' + chalk.green(legov) + '\n');
  
  return fs.listDir(asset).map(function(item) {
    var src = path.join(asset, item);

    //npm会自动把gitignore转为npmignore，这里要做兼容处理
    var dest = item === 'gitignore' ? '.' + item : item;
    dest = path.join(legov, dest);

    return fs.copyFile(src, dest).then(function() {
      console.log('    ' + chalk.magenta(dest));
    });
  }).then(function () {
    fs.mkdir(path.join(legov, '_sublime'));      //sublime项目目录,gulp不支持全局构建。
    fs.mkdir(path.join(legov, '_seed_modules'))  //种子公共模块,方便发布到前端平台目录。
    console.log('\n  初始化完成！请执行以下操作：\n');
    console.log('    $ cd @legov');
    console.log('    $ npm install');
  });
};