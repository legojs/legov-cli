'use strict';

var path = require('path');
var chalk = require('chalk');
var fs = require('hexo-fs');

module.exports = function(target, seed) {
  var legov = path.join(target, '..', '@legov');
  var src = path.join(legov, 'node_modules', 'legov-seed-' + seed);
  var src_wxpay =  path.join(legov, 'node_modules', '@tencent', 'wxpay-seed-' + seed);
  var hasInstall = false;

  //优先找私有包
  if (fs.existsSync(src_wxpay)) {    
    src = src_wxpay;
    hasInstall = true;
  } else if (fs.existsSync(src)) {
    hasInstall = true;
  } 

  if (!hasInstall){
    console.log('\n  [%s]没有找到种子。请确定种子已经就位。', chalk.green(seed));
    console.log('\n  [%s]查找目录为：%s', chalk.green(seed), chalk.green(src));
    console.log('\n  如需帮助，请执行：\n');
    console.log('    $ %s %s -h', chalk.magenta('lv'), chalk.cyan('sown'));
  } else {
    if (fs.existsSync(path.join(target, 'config'))) {
      return console.log('\n  [%s]当前项目已经初始化。', chalk.green(path.join(target)));
    }

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

    var module_target = path.join(legov, '_seed_modules', seed);
    if (fs.existsSync(module_target)) {
      console.log('\n  [%s]当前模块已经初始化。', chalk.green(path.join(target)));
    } else{
      var module = path.join(src, 'module');
      fs.listDir(module).map(function(item) {
        var src = path.join(module, item);
        var dest = path.join(module_target, item);
        return fs.copyFile(src, dest).then(function() {
          console.log('    ' + chalk.magenta(dest));
        });
      }).then(function () {
        console.log('\n  模块初始化完成！');
      });
    }
  };
};