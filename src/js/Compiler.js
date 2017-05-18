"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Languages_1 = require("./Languages");
/*<function name="Compiler">*/
var Compiler = (function () {
    function Compiler() {
    }
    /**
     * 替换语言标记
     *
     * @param code 代码
     * @param options 配置项
     * @example Compiler.replace(): quoted
      ```js
      console.log(compiler.Compiler.replace("language.get('点击<!--{en}click-->')", {
        lang: 'en'
      }));
      // > 'click'
  
      console.log(compiler.Compiler.replace("language.get(`点击<!--{en}click-->`)", {
        lang: 'en'
      }));
      // > `click`
  
      console.log(compiler.Compiler.replace("language.get(\"点击<!--{en}click-->\")", {
        lang: 'en'
      }));
      // > "click"
      ```
     * @example Compiler.replace(): attribute
      ```js
      console.log(compiler.Compiler.replace('<img src="cn.png" data-lang-src="<!--{jp}jp.png--><!--{en}en.png-->">', {
        lang: 'jp'
      }));
      // > <img src="jp.png">
  
      console.log(compiler.Compiler.replace('<img src="cn.png"title="标志"data-lang-title="<!--{jp}標識--><!--{en}logo-->"data-lang-src="<!--{jp}jp.png--><!--{en}en.png-->">', {
        lang: 'jp'
      }));
      // > <img src="jp.png"title="標識">
      ```
     * @example Compiler.replace(): inner html
      ```js
      console.log(compiler.Compiler.replace('<span>中文<!--{en}English--><!--{jp}日本語--></span>', {
        lang: 'jp'
      }));
      // > <span>日本語</span>
  
      console.log(compiler.Compiler.replace('<div title="中文" data-lang-title="<!--{jp}日本語--><!--{en}English-->"><div>中文<!--{en}English--><!--{jp}日本語--></div></div>', {
        lang: 'jp'
      }));
      // > <div title="日本語"><div>日本語</div></div>
      ```
     * @example Compiler.replace(): map
      ```js
      console.log(compiler.Compiler.replace('<span>中文<!--{*}language--></span>', {
        lang: 'jp',
        map: {
          language: '<!--{en}English--><!--{jp}日本語-->'
        }
      }));
      // > <span>日本語</span>
      ```
     * @example Compiler.replace(): coverage
      ```js
      console.log(compiler.Compiler.replace('<span sa-data-lang-title="中文">', {
        lang: 'jp',
      }));
      // > <span sa-data-lang-title="中文">
  
      console.log(compiler.Compiler.replace('中文<!--{en}English--><!--{jp}日本語--></span>', {
        lang: 'jp',
      }));
      // > 中文<!--{en}English--><!--{jp}日本語--></span>
  
      compiler.Compiler();
      ```
     * @example Compiler.replace(): case1
      ```js
      console.log(compiler.Compiler.replace('console.info(languages.get("中文<!--{en}English-->"))', {
        lang: 'en',
      }));
      // > console.info("English")
      ```
     */
    Compiler.replace = function (code, options) {
        var languages = new Languages_1.Languages(options.defaultLang || 'cn', []);
        if (options.map) {
            languages.dictionary(options.map);
        }
        code = String(code).replace(/(?:(?:\w+\.)+)get\((['"`])(.*?-->)\1\)/g, function (all, quoted, text) {
            // console.log(h5i18n.get('中国<!--{en}China--><!--{jp}中国--><!--{fr}Chine-->'))
            return quoted + languages.get(text, options.lang) + quoted;
        }).replace(/<("[^"]*"|'[^']*'|[^'"<>])+(data-lang-\w+)("[^"]*"|'[^']*'|[^'"<>])+>/g, function (all) {
            // <input type="text" placeholder="中文" data-lang-placeholder="<!--{en}English--><!--{jp}日本語-->">
            var dict = {};
            all = all.replace(/((?:\s*)(?:[\w-])*)data-lang((?:-\w+)+)\s*=\s*(['"])([^]*?)(\3)/g, function (all, space, attr, quoted, text) {
                if (space.trim()) {
                    return all;
                }
                dict[attr.slice(1)] = text;
                return space.trim();
            });
            Object.keys(dict).forEach(function (attr) {
                all = all.replace(new RegExp('([\'"\\s]' + attr + '\\s*=\\s*)([\'"])([^]*?)(\\2)', 'g'), function (all, prefix, quoted, text) {
                    return prefix + quoted + languages.get(text + dict[attr], options.lang) + quoted;
                });
            });
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
            match = left.match(new RegExp('<(' + tag + ')(?:"[^"]*"|\'[^\']*\'|[^"\'>])*>(?![^]*<\\1(?:"[^"]*"|\'[^\']*\'|[^"\'>])*>)'));
            if (!match) {
                break;
            }
            text = RegExp["$'"] + text;
            left = left.slice(0, match.index) + match[0];
            code = left + languages.get(text, options.lang) + right;
        } while (true);
        return code;
    };
    return Compiler;
}()); /*</function>*/
exports.Compiler = Compiler;
