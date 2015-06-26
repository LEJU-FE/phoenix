'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var mkdirp = require('mkdirp');
var LJPoseidon = yeoman.generators.Base.extend({
  init: function() {
    this.on('end', function() {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },
  askFor: function() {
    var done = this.async(); // 建议使用this.log() 而不是console.log， 因为在非命令行环境下console.log()不会显示
    var prompts = [{
      type: 'confirm',
      name: 'someOption',
      message: 'Hello boy, would you like to install LJPoseidon?',
      default: true
    }];
    this.prompt(prompts, function(props) {
      this.someOption = props.someOption;
      done();
    }.bind(this));
  },
  app: function() { //创建目录
    mkdirp('LJPoseidon');
    mkdirp('LJPoseidon/js');
    mkdirp('LJPoseidon/js/app');
    mkdirp('LJPoseidon/js/lib');
    mkdirp('LJPoseidon/css');
    mkdirp('LJPoseidon/images');
    mkdirp('LJPoseidon/html'); // this.copy() 第一个参数为源文件名，默认目录为app/templates, 第二个参数为目标文件
    //this.copy('test.html', 'LJPoseidon/html/test.html');
    this.copy('LJajax.js', 'LJPoseidon/js/app/LJajax.js');
    this.copy('LJcore.js', 'LJPoseidon/js/app/LJcore.js');
    //this.copy('LJInterface.js', 'LJPoseidon/js/app/LJInterface.js');
    this.copy('LJAMD.js', 'LJPoseidon/js/app/LJAMD.js');
    this.copy('LJselector.js', 'LJPoseidon/js/app/LJselector.js');
    //this.copy('calender.js', 'LJPoseidon/js/app/calender.js');
    this.copy('_package.json', 'LJPoseidon/package.json');
    this.copy('_bower.json', 'LJPoseidon/bower.json');
    this.copy('server.js', 'LJPoseidon/server.js');
  }
});
module.exports = LJPoseidon;