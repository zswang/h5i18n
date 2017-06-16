#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var colors = require('colors');
var util = require('util');
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
  .option('-e, --extract', 'Extract dictionary.')
  .parse(process.argv);

var contents = [];
var filenames = [];
program.args.forEach(function (filename) {
  filenames.push(filename);
  var languages = new h5i18n.Languages(program.defaultLang || 'cn', []);

  if (fs.existsSync(program.map)) {
    languages.dictionary(JSON.parse(fs.readFileSync(program.map)));
  }
  if (program.extract) {
    var lines = [];
    languages.replace(fs.readFileSync(filename), program.locale, function (type, text) {
      var expr = languages.parse(text, 'cn');
      if (expr) {
        var line = '- type: ' + type + '\n';
        line += '  lang:\n'
        Object.keys(expr.optionsLang).forEach(function (lang) {
          var text = expr.optionsLang[lang].trim();
          if (/["\n:]/.test(text)) {
            text = JSON.stringify(text);
          }
          if (/["*\n:]/.test(lang)) {
            lang = JSON.stringify(lang);
          }
          line += '    ' + lang + ': ' + text + '\n';
        });
        lines.push(line);
      }
    });
    contents.push(lines.join(''));
  } else {
    contents.push(languages.replace(fs.readFileSync(filename), program.locale));
  }
});
var content = contents.join('\n');
if (program.output) {
  mkdirp(path.dirname(program.output));
  fs.writeFileSync(program.output, content);
  console.log(colors.green(util.format('%j h5i18n output complete.', filenames)));
}
else {
  console.log(content);
}