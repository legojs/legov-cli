#!/usr/bin/env node 
var program = require('commander');
var app_info = require('../package.json');
var chalk = require('chalk');
var init = require('../lib/init');
var sown = require('../lib/generator');
var target = process.cwd();

//基本信息
program
  .version(app_info.version)
  .usage(chalk.magenta('[lv|lego]') + ' [options] <cmd>\n\n  ' + app_info.description);

//$ lv init
program
  .command('init')
  .description('初始化前端工程。')
  .action(function () {
    console.log('\n  开始初始化：' + chalk.green(target));
    init(target);
  }).on('--help', function() {
    console.log('  Examples:');
    console.log('    $ mkdir <工程目录>');
    console.log('    $ cd <工程目录>');
    console.log('    $ %s %s', chalk.magenta('lv'), chalk.cyan('init'));
  });

//$ lv seed
program
  .command('generator <seed>')
  .alias('g')
  .description('播种项目（请确定种子已经就位）。')
  .action(function(seed){
    console.log('\n  [%s]开始播种项目~~', chalk.green(seed));
    sown(target, seed);
  }).on('--help', function() {
    console.log('  Examples:');
    console.log('    $ cd "工程目录/@legov"');
    console.log('    $ tnpm i @tencent/wxpay-seed-codeigniter');
    console.log('    $ cd ..              #返回工程目录');
    console.log('    $ mkdir <项目目录>   #建立项目目录（或者从 Svn or Git 拉取）');
    console.log('    $ cd <项目目录>');
    console.log('    $ %s %s codeigniter', chalk.magenta('lv'), chalk.cyan('g'));
  });

program.parse(process.argv);