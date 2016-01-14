#!/usr/bin/env node 
var program = require('commander');
var path = require('path');
var chalk = require('chalk');
var fs = require('hexo-fs');
var yml = require('js-yaml');
var app_info = require('../package.json');

var add = require('../lib/add');

//读取配置文件
var _readConfig = function () {
  var local_yml = path.join(__dirname, 'legov.yml');
  var config = {};
  return Promise.resolve()
  .then(function () {
     //判断bin/legov.yml是否存在
    return fs.exists(local_yml);
  })
  .then(function (exist) {
    //如果存在就读取；否则给一个默认值（yml格式）
    return exist? fs.readFile(local_yml): '\
local:\n\
  yml:\n\
  path:\n\
seed:\n\
  prefix: legov-seed-\n\
leaf:\n\
  prefix: legov-leaf-\n\
site:\n';
  })
  .then(function (data) {
    //将yml转为json
    config = yml.safeLoad(data);
    //本机是否已经初始化?
    //如果已经初始化，被初始化的目录是否还存在？
    return config.local.path? fs.exists(config.local.path): false;
  })
  .then(function (exist) {
    //目录不存在直接置为空值
    if (!exist) {
      config.local.path = ''
    }
    //直接指定配置文件所在地址
    config.local.yml = local_yml
    
    return config;
  })
  .catch(console.log)
}

//基本信息
program
  .version(app_info.version)
  .usage(chalk.magenta('[lv|lego]') + ' [options] <cmd>\n\n  ' + app_info.description);

//$ lv init
program
  .command('init')
  .description('初始化前端工程。')
  .action(function () {
    console.log('\n  开始初始化：' + chalk.green(process.cwd())) + '\n';
    _readConfig().then(function (config) {
      if (config.local.path) {
        return console.log('\n  操作无法执行！@legov已存在：' + chalk.green(config.local.path) + '\n');
      } else {
        require('../lib/init')(config);
      }
    }).catch(console.log);
  })
  .on('--help', function() {
    console.log('  Examples:  \n');
    console.log('    $ mkdir <工程目录>\n');
    console.log('    $ cd <工程目录>\n');
    console.log('    $ %s %s\n', chalk.magenta('lv'), chalk.cyan('init'));
  });

//$ lv get [key]
program
  .command('get [key]')
  .description('获取 LegoV 环境变量。')
  .action(function(key){
    _readConfig().then(function (config) {
      require('../lib/get')(config, key);
    }).catch(console.log);
  })
  .on('--help', function () {
    console.log('  Examples:  \n');
    console.log('    $ %s %s all  \n', chalk.magenta('lv'), chalk.cyan('get'));
    console.log('    $ %s %s local/path  \n', chalk.magenta('lv'), chalk.cyan('get'));
  });


//$ lv set <key> <val>
program
  .command('set <key> <val>')
  .description('配置 LegoV 环境变量。')
  .action(function(key, val){
    _readConfig().then(function (config) {
      require('../lib/set')(config, key, val);
    }).catch(console.log);
  })
  .on('--help', function() {
    console.log('  Examples:  \n');
    console.log('    $ %s %s seed/prefix "@tencent/wxpay-seed-"  #内网前缀，引号是必须的\n', chalk.magenta('lv'), chalk.cyan('set'));
    console.log('    $ %s %s seed/prefix "legov-seed-"  #默认值\n', chalk.magenta('lv'), chalk.cyan('set'));
  });

//$ lv generator <seed>
program
  .command('generate <seed>')
  .alias('g')
  .description('播种站点（请确定种子已经就位）。')
  .action(function (seed) {
    _readConfig().then(function (config) {
      if ('' == config.local.path){
        console.log('\n  尚未初始化工程，请执行以下命令查看帮助：\n');
        console.log('    $ %s %s -h\n', chalk.magenta('lv'), chalk.cyan('init'));
      } else {
        console.log('\n  [%s]开始播种站点~~\n', chalk.green(seed));
        require('../lib/generate')(config, seed);
      }
    }).catch(console.log);
  })
  .on('--help', function() {
    console.log('  Examples:  \n');
    console.log('    $ cd "<工程目录>/@legov"\n');
    console.log('    $ tnpm i @tencent/wxpay-seed-codeigniter\n');
    console.log('    $ cd ..              #返回<工程目录>\n');
    console.log('    $ mkdir <站点目录>   #建立<站点目录>（或者从 Svn or Git 拉取）\n');
    console.log('    $ cd <站点目录>\n');
    console.log('    $ %s %s seed/prefix "@tencent/wxpay-seed-"  #引号是必须的\n', chalk.magenta('lv'), chalk.cyan('set'));
    console.log('    $ %s %s codeigniter\n', chalk.magenta('lv'), chalk.cyan('g'));
    console.log('    $ %s %s              #不加参数，进行补种\n', chalk.magenta('lv'), chalk.cyan('g'));
  });

//$ lv start
program
  .command('start')
  .alias('s')
  .description('启动站点。')
  .action(function () {
    _readConfig().then(function (config) {
      if ('' == config.local.path){
        console.log('\n  尚未初始化工程，请执行以下命令查看帮助：\n');
        console.log('    $ %s %s -h\n', chalk.magenta('lv'), chalk.cyan('init'));
      } else {
        console.log('\n  启动站点~~');
        require('../lib/start')(config);
      }
    }).catch(console.log); 
  })
  .on('--help', function() {
    console.log('  Examples:  \n');
    console.log('    $ cd wxpay.oa.com-boss\n');
    console.log('    $ %s %s\n', chalk.magenta('lv'), chalk.cyan('s'));
  });

//$ lv proxy
program
  .command('proxy')
  .alias('x')
  .description('启动代理服务器。')
  .action(function(){
    _readConfig().then(function (config) {
      if ('' == config.local.path){
        console.log('\n  尚未初始化工程，请执行以下命令查看帮助：\n');
        console.log('    $ %s %s -h\n', chalk.magenta('lv'), chalk.cyan('init'));
      } else {
        console.log('\n  启动反向代理服务器~~');
        require('../lib/proxy')(config);
      }
    }).catch(console.log); 
  })
  .on('--help', function() {
    console.log('  Examples:  \n');
    console.log('    $ cd wxpay.oa.com-boss\n');
    console.log('    $ %s %s\n', chalk.magenta('lv'), chalk.cyan('p'));
  });

//$ lv add <leaf> <name>
program
  .command('add <leaf> <project>')
  .description('增加项目（请确定叶子已经就位）。')
  .action(function(leaf, project){
    _readConfig().then(function (config) {
      if ('' == config.local.path){
        console.log('\n  尚未初始化工程，请执行以下命令查看帮助：\n');
        console.log('    $ %s %s -h\n', chalk.magenta('lv'), chalk.cyan('init'));
      } else {
        console.log('\n  [%s %s]开始增加项目~~\n', chalk.green(leaf), chalk.yellow(project));
        require('../lib/add')(config, leaf, project);
      }
    }).catch(console.log);
  })
  .on('--help', function() {
    console.log('  Examples:  \n');
    console.log('    $ cd "<工程目录>/@legov"\n');
    console.log('    $ tnpm i @tencent/wxpay-leaf-flame\n');
    console.log('    $ cd ../<站点目录>\n');
    console.log('    $ %s %s flame -n project\n', chalk.magenta('lv'), chalk.cyan('add'));
  });  

//$ lv bundle
program
  .command('bundle')
  .alias('b')
  .description('打包服务。')
  .action(function(){
    _readConfig().then(function (config) {
      if ('' == config.local.path){
        console.log('\n  尚未初始化工程，请执行以下命令查看帮助：\n');
        console.log('    $ %s %s -h\n', chalk.magenta('lv'), chalk.cyan('init'));
      } else {
        console.log('\n  开始打包~~');
        require('../lib/bundle')(config);
      }
    }).catch(console.log); 
  })
  .on('--help', function() {
    console.log('  Examples:  \n');
    console.log('    $ cd wxpay.oa.com-boss/views/home\n');
    console.log('    $ %s %s\n', chalk.magenta('lv'), chalk.cyan('b'));
  });

//$ lv publish
program
  .command('publish')
  .alias('p')
  .description('发布项目。')
  .action(function(){
    _readConfig().then(function (config) {
      if ('' == config.local.path){
        console.log('\n  尚未初始化工程，请执行以下命令查看帮助：\n');
        console.log('    $ %s %s -h\n', chalk.magenta('lv'), chalk.cyan('init'));
      } else {
        console.log('\n  开始打包~~');
        require('../lib/publish')(config);
      }
    }).catch(console.log); 
  })
  .on('--help', function() {
    console.log('  Examples:  \n');
    console.log('    $ cd wxpay.oa.com-boss/material/\n');
    console.log('    $ %s %s\n', chalk.magenta('lv'), chalk.cyan('p'));
  });

program.parse(process.argv);