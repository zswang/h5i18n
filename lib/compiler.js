var h5i18n = require('../');

function h5i18n_replace(code, options) {
  options = options || {};
  var languages = new h5i18n.Languages('cn');
  if (options.map) {
    languages.i18n(options.map);
  }
  code = String(code).replace(/(?:(?:\w+\.)+)get\((['"`])(.*?-->)\1\)/g, function (all, quoted, text) {
    // console.log(h5i18n.get('中国<!--{en}China--><!--{jp}中国--><!--{fr}Chine-->'));
    return quoted + languages.get(text, options.lang) + quoted;
  }).replace(/<\w+(?:"[^"]*"|'[^']*'|[^'">])*\s+data-lang-\w+\s*=(?:"[^"]*"|'[^']*'|[^'">])*\/?>/g, function (all) {
    // <input type="text" placeholder="中文" data-lang-placeholder="<!--{en}English--><!--{jp}日本語-->">
    var dict = {};
    all = all.replace(/(\s+)data-lang((?:-\w+)+)\s*=\s*(['"])([^]*?)(\3)/g, function (all, space, attr, quoted, text) {
      dict[attr.slice(1)] = text;
      return '';
    });
    Object.keys(dict).forEach(function (attr) {
      all = all.replace(new RegExp('(\\s+' + attr + '\\s*=\\s*)([\'"])([^]*?)(\\2)', 'g'), function (all, prefix, quoted, text) {
        return prefix + quoted + languages.get(text + dict[attr], options.lang) + quoted;
      });
    })
    return all;
  });

  do {
    // <span>中文<!--{en}English--><!--{jp}日本語--></span>
    var match = code.match(/((?:<!--\{(?:[\w*]+)\}.*?-->\s*)+)(<\/(\w+)>)/);
    if (!match) {
      break;
    }
    var tag = match[3];
    var text = match[1];
    var left = RegExp['$`'];
    var right = match[2] + RegExp["$'"];

    match = left.match(
      new RegExp('<(' + tag + ')(?:"[^"]*"|\'[^\']*\'|[^"\'>])*>(?![^]*<\\1(?:"[^"]*"|\'[^\']*\'|[^"\'>])*>)')
    );

    if (!match) {
      break;
    }
    text = RegExp["$'"] + text;
    left = left.slice(0, match.index) + match[0];
    code = left + languages.get(text, options.lang) + right;

  } while(true);

  return code;
}

exports.replace = h5i18n_replace;