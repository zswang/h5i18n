#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var colors = require('colors');
var util = require('util');
var packageInfo = require('./package.json');
var program = require('commander');
var h5i18n = require('./');
var glob = require('glob');
var yaml = require('js-yaml');

program
  .version(packageInfo.version)
  .usage('[options] <file ...>')
  .option('-o, --output <file>', 'output file')
  .option('-d, --defaultLang <default language>', 'set default language.')
  .option('-l, --locale <language>', 'set current language.')
  .option('-v, --version', 'output version number and exit')
  .option('-m, --map <i18n file>', 'map of langs file.')
  .option('-e, --extract', 'Extract dictionary.')
  .option('-u, --update <update config>', 'update config file.')
  .parse(process.argv);

var langs = new h5i18n.Languages(program.defaultLang || 'cn', []);

if (fs.existsSync(program.map)) {
  langs.dictionary(JSON.parse(fs.readFileSync(program.map)));
}

if (program.update) {
  var config = yaml.load(fs.readFileSync(program.update));
  config.forEach(function (item) {
    var filename = path.join(path.dirname(program.update), item.file);
    if (!fs.existsSync(filename)) {
      console.error('File %j not exists.', item.file);
    }
    var updateItems = {};
    var exists;
    item.i18n.forEach(function (sub) {
      if (sub.update && sub.lang) {
        exists = true;
        updateItems[langs.build(langs.locale, {
          optionsLang: sub.lang
        }, true)] = {
            optionsLang: sub.update
          }
      }
    })

    if (!exists) {
      return;
    }

    var change = 0;
    var content = langs.replace(fs.readFileSync(filename), langs.locale, function (type, text) {
      var expr = langs.parse(text, langs.locale);
      if (expr) {
        var origin = langs.build(langs.locale, expr, true);
        if (updateItems[origin]) {
          change++;
          return updateItems[origin];
        }
      }
      return false;
    });

    if (change) {
      fs.writeFileSync(filename, content)
      console.log(colors.green(util.format('The file %j has been overwritten.', filename)));
    }
  });
  return;
}

var contents = [];
var filenames = [];

program.args.forEach(function (filename) {

  new glob(filename, {
    sync: true
  }).forEach(function (item) {
    if (filenames.indexOf(item) < 0) {
      filenames.push(item);
    }
  });

});

filenames.forEach(function (filename) {
  if (program.extract) {
    var lines = [];
    var duplicate = {}; // 排除重复
    langs.replace(fs.readFileSync(filename), langs.locale, function (type, text) {
      var expr = langs.parse(text, langs.locale);
      /* istanbul ignore else */
      if (expr) {
        var origin = langs.build(langs.locale, expr, true)
        if (duplicate[origin]) {
          return;
        }
        duplicate[origin] = true;

        var line = '  - lang: \n';
        Object.keys(expr.optionsLang).forEach(function (lang) {
          var text = expr.optionsLang[lang].trim();
          if (/['"`%@&\n{}\[\],:]/.test(text)) {
            text = JSON.stringify(text);
          }
          if (/['"`%@&\n{}\[\],:*]/.test(lang)) {
            lang = JSON.stringify(lang);
          }
          line += '      ' + lang + ': ' + text + '\n';
        });
        lines.push(line);
      }
    });
    if (lines.length) {
      var fn;
      /* istanbul ignore else */
      if (program.output) {
        fn = path.relative(path.dirname(program.output), filename);
      } else if (process.env.PWD) {
        fn = path.relative(process.env.PWD, filename);
      } else {
        fn = path.basename(filename);
      }
      contents.push('- file: ' + fn + '\n  i18n:\n' + lines.join(''));
    }
  } else {
    contents.push(langs.replace(fs.readFileSync(filename), program.locale));
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