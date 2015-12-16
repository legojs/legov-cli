'use strict';

var path = require('path');
var chalk = require('chalk');
var fs = require('hexo-fs');

module.exports = function(current, seed) {
  var legov = path.join(current, '..', '@legov');
  var hasInstall = false;
  //先找包全名，例如： @tencent/wxpay-seed-codeigniter
  var src = path.join(legov, 'node_modules', seed);
  if (fs.existsSync(src)) {
    hasInstall = true;
  } else {
    //语法糖，直接找缩写形式的
    src = path.join(legov, 'node_modules', 'legov-seed-' + seed);
    if (fs.existsSync(src)) {      
      hasInstall = true;
    }   
  } 

  if (!hasInstall) {
    console.log('\n  [%s]没有找到种子。请确定种子已经就位。', chalk.green(seed));
    console.log('\n  [%s]查找目录为：%s', chalk.green(seed), chalk.green(src));
    console.log('\n  如需帮助，请执行：\n');
    console.log('    $ %s %s -h', chalk.magenta('lv'), chalk.cyan('g'));
  } else {
    var asset = path.join(src, 'asset');
    fs.listDir(asset).map(function (item) {
      var src = path.join(asset, item);
      var dest = path.join(current, item);

      fs.exists(dest).then(function (exist) {
        if(!exist){
          return fs.copyFile(src, dest).then(function() {
            console.log('    ' + chalk.magenta(dest));
          }); 
        } else {
          return console.log('    ' + chalk.red('文件已经存在：' + dest));
        }
      });
    }).then(function () {
      console.log('\n  资源初始化完成！');
    });

    var module_current = path.join(legov, '_seed_modules', seed);
    if (fs.existsSync(module_current)) {
      console.log('\n  [%s]当前模块已经初始化。', chalk.green(path.join(current)));
    } else{
      var module = path.join(src, 'module');
      fs.listDir(module).map(function(item) {
        var src = path.join(module, item);
        var dest = path.join(module_current, item);
        if (!fs.existsSync(dest)){
          return fs.copyFile(src, dest).then(function() {
            console.log('    ' + chalk.magenta(dest));
          });
        } else {
          return console.log('    ' + chalk.red('文件已经存在：' + dest));
        }
      }).then(function () {
        console.log('\n  模块初始化完成！');
      });
    }
  };
};