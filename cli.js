#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var packageInfo = require('./package.json');
var program = require('commander');
var h5i18n = require('./');

program
  .version(packageInfo.version)
  .usage('[options] <file ...>')
  .option('-o, --output <file>', 'output file')
  .option('-d, --defaultLang <default language>', 'set default language.')
  .option('-l, --locale <language>', 'set current language.')
  .option('-v, --version', 'output version number and exit')
  .option('-m, --map <i18n file>', 'map of languages file.')
  .parse(process.argv);

var contents = [];
var filenames = [];
program.args.forEach(function (filename) {
  filenames.push(filename);
  var languages = new h5i18n.Languages(program.defaultLang || 'cn', []);

  if (fs.existsSync(program.map)) {
    languages.dictionary(JSON.parse(fs.readFileSync(program.map)));
  }
  contents.push(languages.replace(fs.readFileSync(filename), program.locale));
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