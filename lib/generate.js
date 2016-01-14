'use strict';

var path = require('path');
var chalk = require('chalk');
var fs = require('hexo-fs');
var yml = require('js-yaml');

module.exports = function(config, seed) {
  var seed_path = path.join(config.local.path, 'node_modules', config.seed.prefix + seed);

  return fs.exists(seed_path)
  .then(function (exist) {
    if (exist) {
      var asset = seed_path;
      //拷贝种子站点中的资源到当前目录
      return fs.listDir(asset).map(function (item) {
        var src = path.join(asset, item);
        //npm会自动把gitignore转为npmignore，这里要做兼容处理
        var dest = item === 'gitignore' ? '.' + item : item;
        dest = path.join(process.cwd(), item);

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
      console.log('\n  [%s]没有找到种子。请确定种子已经就位。', chalk.red(seed));
      console.log('\n  [%s]查找目录为：%s', chalk.red(seed), chalk.red(seed_path));
      console.log('\n  如需帮助，请执行：\n');
      console.log('    $ %s %s -h', chalk.magenta('lv'), chalk.cyan('g'));
    }
  })
  .then(function () {
    console.log('\n  站点初始化完成！');
  });
};