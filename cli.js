#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var packageInfo = require('./package.json');

var compiler = require('./lib/compiler.js');

var program = require('commander');

program
  .version(packageInfo.version)
  .usage('[options] <file ...>')
  .option('-o, --output <file>', 'output file')
  .option('-d, --defaultLang <default language>', 'set default language.')
  .option('-l, --lang <language>', 'set current language.')
  .option('-v, --version', 'output version number and exit')
  .option('-m, --map <i18n file>', 'map of languages file.')
  .parse(process.argv);

var contents = [];
var filenames = [];
program.args.forEach(function (filename) {
  filenames.push(filename);
  var i18n;
  if (fs.existsSync(program.map)) {
    i18n = JSON.parse(fs.readFileSync(program.map));
  }
  contents.push(compiler.Compiler.replace(fs.readFileSync(filename), {
    defaultLang: program.defaultLang,
    lang: program.lang,
    map: i18n,
  }));
});
var content = contents.join('\n');
if (process.output) {
  mkdirp(path.dirname(process.output));
  fs.writeFileSync(process.output, content);
  console.log(colors.green(util.format('%j linenum output complete.', filenames)));
}
else {
  console.log(content);
}