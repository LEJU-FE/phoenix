'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var mkdirp = require('mkdirp');
var LEJUjquery = yeoman.generators.Base.extend({
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
      message: 'Hello boy, would you like to install leju base-jquery?',
      default: true
    }];
    this.prompt(prompts, function(props) {
      this.someOption = props.someOption;
      done();
    }.bind(this));
  },
  app: function() { //创建目录
    mkdirp('base-jquery');
    mkdirp('base-jquery/js');
    mkdirp('base-jquery/js/lib');
    mkdirp('base-jquery/js/app');
    mkdirp('base-jquery/css');
    mkdirp('base-jquery/images');
    this.copy('base-jquery/template.html', 'base-jquery/template.html');
    this.copy('base-jquery/js/app/jquery-2.1.4.js', 'base-jquery/js/app/jquery-2.1.4.js');
    this.copy('base-jquery/js/app/core.js', 'base-jquery/js/app/core.js');
  }
});
module.exports = LEJUjquery;