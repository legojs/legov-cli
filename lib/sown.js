'use strict';

var path = require('path');
var chalk = require('chalk');
var fs = require('hexo-fs');

module.exports = function(target, seed) {
  if (fs.existsSync(path.join(target, '_config.yml'))) {
    return console.log('\n  [%s]当前项目已经初始化。', chalk.green(path.join(target)));
  }

  var src = path.join(target, '..', '@legov', 'node_modules', 'legov-seed-' + seed);
  if (!fs.existsSync(path.join(src))) {
    console.log('\n  [%s]没有找到种子。请确定种子已经就位。', chalk.green(seed));
    console.log('\n  [%s]查找目录为：%s', chalk.green(seed), chalk.green(src));
    console.log('\n  如需帮助，请执行：\n');
    console.log('    $ %s %s -h', chalk.magenta('lv'), chalk.cyan('sown'));
  } else {
    var asset = path.join(src, 'asset');
    fs.listDir(asset).map(function(item) {
      var src = path.join(asset, item);
      var dest = path.join(target, item);

      return fs.copyFile(src, dest).then(function() {
        console.log('    ' + chalk.magenta(dest));
      });
    }).then(function () {
      console.log('\n  资源初始化完成！');
    });  
  }
};