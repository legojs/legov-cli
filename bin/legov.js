#!/usr/bin/env node 
var program = require('commander');
var app_info = require('../package.json');
var chalk = require('chalk');
var init = require('../lib/init');
var generator = require('../lib/generator');
var update = require('../lib/update');
var start = require('../lib/start');
var proxy = require('../lib/proxy');
var add = require('../lib/add');
var current = process.cwd();

//基本信息
program
  .version(app_info.version)
  .usage(chalk.magenta('[lv|lego]') + ' [options] <cmd>\n\n  ' + app_info.description);

//$ lv init
program
  .command('init')
  .description('初始化前端工程。')
  .action(function () {
    console.log('\n  开始初始化：' + chalk.green(current)) + '\n';
    init(current);
  }).on('--help', function() {
    console.log('  Examples:');
    console.log('    $ mkdir <工程目录>');
    console.log('    $ cd <工程目录>');
    console.log('    $ %s %s', chalk.magenta('lv'), chalk.cyan('init'));
  });

//$ lv generator <seed>
program
  .command('generator <seed>')
  .alias('g')
  .description('播种站点（请确定种子已经就位）。')
  .action(function(seed){
    console.log('\n  [%s]开始播种站点~~', chalk.green(seed)) + '\n';
    generator(current, seed);
  }).on('--help', function() {
    console.log('  Examples:');
    console.log('    $ cd "<工程目录>/@legov"');
    console.log('    $ tnpm i @tencent/wxpay-seed-codeigniter');
    console.log('    $ cd ..              #返回<工程目录>');
    console.log('    $ mkdir <站点目录>   #建立<站点目录>（或者从 Svn or Git 拉取）');
    console.log('    $ cd <站点目录>');
    console.log('    $ %s %s @tencent/wxpay-seed-codeigniter', chalk.magenta('lv'), chalk.cyan('g'));
  });

//$ lv update <seed>
program
  .command('update <seed>')
  .alias('up')
  .description('升级站点（请确定种子已经就位）。')
  .action(function(seed){
    console.log('\n  [%s]开始升级站点~~', chalk.green(seed)) + '\n';
    update(current, seed);
  }).on('--help', function() {
    console.log('  Examples:');
    console.log('    $ cd "@legov"');
    console.log('    $ tnpm up @tencent/wxpay-seed-codeigniter');
    console.log('    $ %s %s @tencent/wxpay-seed-codeigniter', chalk.magenta('lv'), chalk.cyan('u'));
  });

//$ lv start
program
  .command('start')
  .alias('s')
  .description('启动站点。')
  .action(function(){
    start(current);
  }).on('--help', function() {
    console.log('  Examples:');
    console.log('    $ cd wxpay.oa.com-boss');
    console.log('    $ %s %s', chalk.magenta('lv'), chalk.cyan('s'));
  });

//$ lv proxy
program
  .command('proxy')
  .alias('p')
  .description('启动代理服务器。')
  .action(function(){
    proxy(current);
  }).on('--help', function() {
    console.log('  Examples:');
    console.log('    $ cd wxpay.oa.com-boss');
    console.log('    $ %s %s', chalk.magenta('lv'), chalk.cyan('p'));
  });

//$ lv add <leaf>
program
  .command('add <leaf>')
  .description('增加项目（请确定叶子已经就位）。')
  .action(function(leaf){
    console.log('\n  [%s]开始增加项目~~', chalk.green(leaf)) + '\n';
    add(current, leaf);
  }).on('--help', function() {
    console.log('  Examples:');
    console.log('    $ cd "<工程目录>/@legov"');
    console.log('    $ tnpm i @tencent/wxpay-leaf-flame');
    console.log('    $ cd ../<站点目录>');
    console.log('    $ %s %s flame -n project', chalk.magenta('lv'), chalk.cyan('add'));
  });  

program.parse(process.argv);