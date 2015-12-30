'use strict';

var path = require('path');
var chalk = require('chalk');
var fs = require('hexo-fs');
var yml = require('js-yaml');

module.exports = function(config, leaf, project) {
  var leaf_path = path.join(config.local.path, 'node_modules', config.leaf.prefix + leaf);

  return fs.exists(leaf_path)
  .then(function (exist) {
    if (exist) {
      var cwd = process.cwd();
      //拷贝种子站点中的资源到当前目录
      return fs.listDir(leaf_path).map(function (item) {
        var src = path.join(leaf_path, item);
        var dest = path.join(cwd, project, item.replace('home', project));

        return fs.exists(dest).then(function (exist) {
          if(!exist){
            return fs.copyFile(src, dest).then(function() {
              console.log('    ' + chalk.magenta(dest));
            }); 
          } else {
            return console.log('\n    ' + chalk.red('文件已经存在：' + dest));
          }
        });
      });
    } else {
      console.log('\n  [%s]没有找到种子。请确定种子已经就位。', chalk.red(leaf));
      console.log('\n  [%s]查找目录为：%s', chalk.red(leaf), chalk.red(leaf_path));
      console.log('\n  如需帮助，请执行：\n');
      console.log('    $ %s %s -h', chalk.magenta('lv'), chalk.cyan('g'));
    }
  })
  .then(function () {
    console.log('\n  项目初始化完成！');
  });
};