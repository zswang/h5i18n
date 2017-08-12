var h5i18n = require('../')

var langs = new h5i18n.Languages('cn');

var text = langs.build('cn', {
  optionsLang: {
    cn: "中文",
    todo: null
  }
}, true);

console.log(text)