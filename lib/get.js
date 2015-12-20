'use strict';

var chalk = require('chalk');

module.exports = function(config, key) {
  if (!key || 'all' == key){
     console.log('\n  所有环境变量如下：\n');
     console.dir(config);
     return console.log('\n');
   } else {
     var look = config;
     key = key.split('/');
     for (var i = 0, len = key.length; i < len; i++){       
       look = look[key[i]];
       if(typeof(look) ==  "undefined"){
         return console.log('\n  [%s]未定义此变量。\n', chalk.red(key.join('/')));
       }
     }
     console.log('\n  [%s]：\n', chalk.green(key.join('/')));
     console.dir(look);
     return console.log('\n');     
   }
}