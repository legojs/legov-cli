'use strict';

var path = require('path');
var chalk = require('chalk');
var fs = require('hexo-fs');
var yml = require('js-yaml');

module.exports = function (config) {
  var local = path.join(process.cwd(), '@legov');
  var local_yml = config.local.yml;

  //写入@legov安装路径
  config.local.path = local;
  fs.writeFile(local_yml, yml.safeDump(config));

  console.log('\n  拷贝文件到：' + chalk.green(local) + '\n');
  var asset = path.join(local_yml, '../../asset');

  return fs.listDir(asset).map(function(item) {
    var src = path.join(asset, item);

    //npm会自动把gitignore转为npmignore，这里要做兼容处理
    var dest = item === 'gitignore' ? '.' + item : item;
    dest = path.join(local, dest);

    return fs.copyFile(src, dest)
      .then(function() {
        console.log('    ' + chalk.magenta(dest));
      });
  })
  .then(function (data) {
    console.log('\n  初始化完成！请执行以下操作：\n');
    console.log('    $ cd @legov');
    console.log('    $ npm install');
  })
  .catch(console.dir)
};