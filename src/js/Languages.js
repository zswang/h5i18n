"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Emitter_1 = require("h5emitter/src/ts/Emitter");
/*<function name="Languages" depend="Emitter">*/
/*<jdists encoding="ejs" data="../../package.json">*/
/**
 * @file <%- name %>
 <% if (typeof repository != 'undefined') { %>
 * @url <%- repository.url %>
 <% } %>
 * <%- description %>
 * @author
     <% (author instanceof Array ? author : [author]).forEach(function (item) { %>
 *   <%- item.name %> (<%- item.url %>)
     <% }); %>
 * @version <%- version %>
     <% var now = new Date() %>
 * @date <%- [
      now.getFullYear(),
      now.getMonth() + 101,
      now.getDate() + 100
    ].join('-').replace(/-1/g, '-') %>
 * @license <%- license %>
 */
/*</jdists>*/
/**
 * 翻译
 *
 * see @https://github.com/jaywcjlove/translater.js
 */
/**
 * 需要处理元素属性集合
 */
var languages_attrs = ['alt', 'src', 'title', 'value', 'placeholder', 'label'];
/**
 * @example Languages:base
  ```html
  <span>中文1<!--{en}English1--></span>
  <span>中文2<!--{en}English2--></span>
  <span>中文3<!--{en}English3--><!--{cn}中文3--></span>
  <span>Hello<!--World!--></span>
  ```
  ```js
  var langs = new h5i18n.Languages();
  langs.update('en');

  var span1 = document.querySelector('span:nth-of-type(1)');
  console.log(span1.innerHTML);
  // > <!--{en}-->English1<!--/{en}--><!--{cn}中文1-->

  var span2 = document.querySelector('span:nth-of-type(2)');
  console.log(span2.innerHTML);
  // > <!--{en}-->English2<!--/{en}--><!--{cn}中文2-->

  langs.update('cn');
  console.log(span1.innerHTML);
  // > <!--{en}English1--><!--{cn}-->中文1<!--/{cn}-->

  console.log(span2.innerHTML);
  // > <!--{en}English2--><!--{cn}-->中文2<!--/{cn}-->

  langs.update('none');
  console.log(span1.innerHTML);
  // > <!--{en}English1--><!--{cn}中文1--><!--{cn}-->中文1<!--/{cn}-->

  console.log(span2.innerHTML);
  // > <!--{en}English2--><!--{cn}中文2--><!--{cn}-->中文2<!--/{cn}-->

  var global_document = global.document;
  delete global.document;
  langs.update('en');
  global.document = global_document;
  ```
 * @example Languages:title
  ```html
  <head>
    <title data-lang-content="<!--{en}example--><!--{jp}サンプル-->">示例</title>
  </head>
  ```
  ```js
  var langs = new h5i18n.Languages('cn');
  langs.update('en');
  console.log(document.title);
  // > example

  langs.update('none');
  console.log(document.title);
  // > 示例
  ```
 * @example Languages:attr
  ```html
  <head>
    <title>示例</title>
  </head>
  <body>
    <img src="img/cn.png" data-lang-src="<!--{en}img/en.png-->">
    <img src="img/cn.png" data-lang-src="<!--{cn}img/cn.png--><!--{en}img/en.png-->">
    <img src="img/cn.png" data-lang-src="none">
  </body>
  ```
  ```js
  var langs = new h5i18n.Languages('cn');
  langs.update('en');
  var img = document.querySelector('img');
  console.log(img.getAttribute('src'));
  // > img/en.png

  langs.update('none');
  var img = document.querySelector('img');
  console.log(img.getAttribute('src'));
  // > img/cn.png
  ```
 * @example Languages:update default
  ```html
  <body>
    <span>中文1<!--{en}English1--></span>
    <span>中文2<!--{en}English2--></span>
  </body>
  ```
  ```js
  var langs = new h5i18n.Languages('cn');
  var span1 = document.querySelector('span:nth-of-type(1)');
  langs.update('en', span1);

  console.log(span1.innerHTML);
  // > <!--{en}-->English1<!--/{en}--><!--{cn}中文1-->

  var span2 = document.querySelector('span:nth-of-type(2)');
  console.log(span2.innerHTML);
  // > 中文2<!--{en}English2-->
  ```
 * @example Languages:update selector
  ```html
  <span>中文1<!--{en}English1--></span>
  <span>中文2<!--{en}English2--></span>
  ```
  ```js
  var langs = new h5i18n.Languages('cn');
  var span1 = document.querySelector('span:nth-of-type(1)');
  langs.update('en', 'span:nth-of-type(1)');

  console.log(span1.innerHTML);
  // > <!--{en}-->English1<!--/{en}--><!--{cn}中文1-->

  var span2 = document.querySelector('span:nth-of-type(2)');
  console.log(span2.innerHTML);
  // > 中文2<!--{en}English2-->
  ```
 * @example Languages:update empty
  ```html
  <head>
    <title data-lang-content="">示例</title>
  </head>
  <body>
    <div>
      <span>中文<!--{en}English--></span>
      empty<!--empty-->
    </div>
  </body>
  ```
  ```js
  var langs = new h5i18n.Languages('cn');
  var div = document.querySelector('div');
  langs.update('en');

  console.log(JSON.stringify(div.innerHTML.replace(/\s+/g, '')));
  // > "<span><!--{en}-->English<!--/{en}--><!--{cn}中文--></span>empty<!--empty-->"
  ```
 * @example Languages:update not found
  ```html
  <span><!--{en}--></span>
  ```
  ```js
  var langs = new h5i18n.Languages('cn');
  var span = document.querySelector('span');
  langs.update();

  console.log(span.innerHTML);
  // > <!--{en}--><!--{cn}--><!--/{cn}-->
  ```
 * @example Languages:live
  ```html
  <div></div>
  ```
  ```js
  var langs = new h5i18n.Languages('cn');
  var div = document.querySelector('div');
  langs.update('en');
  div.innerHTML = '<span>中文<!--{en}English--></span>';
  langs.update();

  console.log(div.innerHTML);
  // > <span><!--{en}-->English<!--/{en}--><!--{cn}中文--></span>
  ```
 * @example Languages:extended attribute
  ```html
  <div cname="中文" data-lang-cname="<!--{en}English-->"></div>
  ```
  ```js
  var langs = new h5i18n.Languages('cn', ['cname']);
  var div = document.querySelector('div');
  langs.update('en');
  console.log(div.getAttribute('cname'));
  // > English
  ```
 * @example Languages:event
  ```js
  var langs = new h5i18n.Languages('cn');
  var logs = '';
  function fn(lang) {
    logs += 'on(' + lang + ')';
  }
  langs.on('change', fn);
  langs.once('change', function (lang) {
    logs += 'once(' + lang + ')';
  });
  langs.update('en');
  langs.update('jp');
  langs.update('jp');
  console.log(logs);
  // > on(en)once(en)on(jp)

  langs.off('change', fn);
  langs.update('en');
  console.log(logs);
  // > on(en)once(en)on(jp)
  ```
 * @example Languages:empty
  ```js
  var langs = new h5i18n.Languages('cn');
  console.log(3 + langs.get('个<!--{en}-->', 'en'));
  // > 3
  ```
 */
var Languages = (function (_super) {
    __extends(Languages, _super);
    /**
     * 构造多语言工具
     *
     * @param _defaultLang 默认语言
     * @param _attrs 替换的属性列表
     */
    function Languages(_defaultLang, _attrs) {
        if (_defaultLang === void 0) { _defaultLang = 'cn'; }
        var _this = _super.call(this) || this;
        _this._defaultLang = _defaultLang;
        _this._locale = _defaultLang;
        _this._attrs = _attrs || languages_attrs;
        _this._dictionarys = {};
        return _this;
    }
    /**
     * 增加语言字典
     *
     * @param blos 语言字典
     * @example dictionary():base
      ```js
      var langs = new h5i18n.Languages('cn');
      langs.dictionary({
        'click': '点击<!--{en}click--><!--{jp}クリック-->',
        'dblclick': '双击<!--{en}Double click--><!--{jp}ダブルクリック-->',
      });
  
      console.log(langs.get('<!--{*}click-->'));
      // > 点击
  
      console.log(langs.get('<!--{*}dblclick-->', 'jp'));
      // > ダブルクリック
  
      console.log(langs.get('<!--{*}dblclick-->', 'none'));
      // > 双击
  
      console.log(langs.get('默认双击<!--{*}dblclick-->', 'none'));
      // > 默认双击
  
      langs.dictionary();
      console.log(langs.get('空<!--{*}none-->'));
      // > 空
  
      console.log(langs.get('无设置'));
      // > 无设置
  
      ```
     * @example dictionary():default key
      ```js
      var langs = new h5i18n.Languages('cn');
      langs.dictionary({
        'click': '点击<!--{en}click--><!--{jp}クリック-->',
        'dblclick': '双击<!--{en}Double click--><!--{jp}ダブルクリック-->',
      });
  
      console.log(langs.get('click<!--{*}-->'));
      // > 点击
  
      console.log(langs.get('click<!--{*}-->', 'jp'));
      // > クリック
  
      console.log(langs.get('none<!--{*}-->'));
      // > none
      ```
     */
    Languages.prototype.dictionary = function (blos) {
        var _this = this;
        if (!blos) {
            return;
        }
        Object.keys(blos).forEach(function (key) {
            _this._dictionarys[key] = blos[key];
        });
    };
    /**
     * 解析文本为语言表达式
     *
     * @param text 文本
     */
    Languages.prototype.parse = function (text) {
        var result = {
            optionsLang: {},
            locale: null,
            localeText: null,
        };
        var find;
        text = String(text).replace(/<!--\{([\w-]+)\}-->([^]*?)<!--\/\{\1\}-->|<!--\{([\w-]+|\*)\}([^]*?)-->/g, function (all, locale, localeText, optionLang, optionText) {
            find = true;
            if (locale) {
                result.locale = locale;
                result.localeText = localeText;
                result.optionsLang[locale] = localeText;
            }
            else {
                result.optionsLang[optionLang] = optionText;
            }
            return '';
        });
        if (!find) {
            return null;
        }
        text = text.trim();
        if (text) {
            result.defaultText = text;
            if (!result.optionsLang[this._defaultLang]) {
                result.optionsLang[this._defaultLang] = text;
            }
        }
        if (result.optionsLang['*'] !== undefined) {
            var t_1;
            if (result.optionsLang['*'] === '') {
                t_1 = this.parse(this._dictionarys[text]);
            }
            else {
                t_1 = this.parse(this._dictionarys[result.optionsLang['*']]);
            }
            if (t_1) {
                Object.keys(t_1.optionsLang).forEach(function (key) {
                    result.optionsLang[key] = t_1.optionsLang[key];
                });
                result.locale = result.locale || t_1.locale;
                result.localeText = result.localeText || t_1.localeText;
            }
        }
        return result;
    };
    /**
     * 将语言表达式编译为文本
     *
     * @param locale 语言
     * @param langExpression 语言表达式对象
     * @param isOriginal 试用原始格式
     * @example build():base
      ```js
      var langs = new h5i18n.Languages('cn');
      var text = langs.build('hk', {
        optionsLang: {
          cn: '默认',
          en: 'Default',
        }
      }, true);
      console.log(text);
      // > 默认<!--{cn}默认--><!--{en}Default-->
      ```
     * @example build():case 2
      ```js
      var langs = new h5i18n.Languages('cn');
      var text = langs.build('jp',
        {
          optionsLang: { jp: '日本語', en: 'English!!', cn: '中文', ne: '🔥' },
          locale: null,
          localeText: null,
          defaultText: '中文'
        }, true
      );
      console.log(text);
      // > 日本語<!--{en}English!!--><!--{cn}中文--><!--{ne}🔥-->
      ```
  
      */
    Languages.prototype.build = function (locale, langExpression, isOriginal) {
        if (isOriginal === void 0) { isOriginal = false; }
        var result = '';
        Object.keys(langExpression.optionsLang).forEach(function (lang) {
            var text = langExpression.optionsLang[lang];
            if (lang === locale) {
                if (isOriginal) {
                    result = "" + text + result;
                }
                else {
                    result += "<!--{" + lang + "}-->" + text + "<!--/{" + lang + "}-->";
                }
            }
            else {
                result += "<!--{" + lang + "}" + text + "-->";
            }
        });
        if (!langExpression.optionsLang[locale]) {
            var lang = this._defaultLang;
            var text = langExpression.optionsLang[this._defaultLang] || '';
            if (isOriginal) {
                result = "" + text + result;
            }
            else {
                result += "<!--{" + lang + "}-->" + text + "<!--/{" + lang + "}-->";
            }
        }
        return result;
    };
    /**
     * 更新语言
     *
     * @param lang 语言
     * @param parent 更新的节点，默认为全部
     */
    Languages.prototype.update = function (_locale, parent) {
        var _this = this;
        _locale = _locale || this._locale;
        if (this._locale !== _locale) {
            this._locale = _locale;
            this.emit('change', _locale);
        }
        // run in node
        if (typeof document === 'undefined') {
            return;
        }
        if (!parent) {
            parent = document.documentElement;
        }
        else if (typeof parent === 'string') {
            parent = document.querySelector(parent);
        }
        // 处理文本节点
        var nodeIterator = document.createNodeIterator(parent, NodeFilter.SHOW_COMMENT, null, false);
        var processNodes = [];
        var processTexts = [];
        var node;
        while ((node = nodeIterator.nextNode())) {
            if (processNodes.indexOf(node.parentNode) >= 0 ||
                /^(script|style|link)$/i.test(node.parentNode.nodeName) ||
                !(/^\{[\w-]+\}/.test(node.nodeValue))) {
                continue;
            }
            processNodes.push(node.parentNode);
            processTexts.push(this.parse(node.parentNode.innerHTML));
        }
        processNodes.forEach(function (node, index) {
            node.innerHTML = _this.build(_locale, processTexts[index]);
        });
        this._attrs.forEach(function (attr) {
            var langAttr = "data-lang-" + attr;
            var elements = [].slice.call(parent.querySelectorAll("[" + langAttr + "]"));
            elements.forEach(function (element) {
                var langText = element.getAttribute(langAttr);
                var langExpression = _this.parse(langText);
                if (!langExpression) {
                    return;
                }
                if (!langExpression.optionsLang[_this._defaultLang]) {
                    langExpression.optionsLang[_this._defaultLang] = element.getAttribute(attr);
                }
                element.setAttribute(langAttr, _this.build(_locale, langExpression));
                element.setAttribute(attr, langExpression.optionsLang[_locale] ||
                    langExpression.optionsLang[_this._defaultLang]);
            });
        });
        if (parent === document.documentElement) {
            var contentAttr = 'data-lang-content';
            var element = document.querySelector('title');
            if (element) {
                if (element.hasAttribute(contentAttr)) {
                    var langText = element.getAttribute(contentAttr);
                    var langExpression = this.parse(langText);
                    if (!langExpression) {
                        return;
                    }
                    if (!langExpression.optionsLang[this._defaultLang]) {
                        langExpression.optionsLang[this._defaultLang] = element.textContent;
                    }
                    element.setAttribute(contentAttr, this.build(_locale, langExpression));
                    element.textContent =
                        langExpression.optionsLang[_locale] ||
                            langExpression.optionsLang[this._defaultLang];
                }
            }
        }
    };
    /**
     * 获取表达式中的文字
     *
     * @param langText 表达式
     * @param locale 语言，默认为当前语言
     */
    Languages.prototype.get = function (langText, locale) {
        locale = locale || this._locale;
        var langExpression = this.parse(langText);
        if (!langExpression) {
            return langText;
        }
        if (langExpression.optionsLang[locale] !== undefined) {
            return langExpression.optionsLang[locale];
        }
        if (langExpression.defaultText !== undefined) {
            return langExpression.defaultText;
        }
        return langExpression.optionsLang[this._defaultLang];
    };
    Object.defineProperty(Languages.prototype, "locale", {
        /**
         * 获取当前语言
         * @example Languages:get locale()
          ```js
          var langs = new h5i18n.Languages('cn');
          console.log(langs.locale);
          // > cn
      
          langs.update('en');
          console.log(langs.locale);
          // > en
          ```
         */
        get: function () {
            return this._locale;
        },
        /**
         * 获取当前语言
         * @example Languages:set locale()
          ```js
          var langs = new h5i18n.Languages('cn');
          var count = 0;
          langs.on('change', function () {
            count++;
          });
          langs.locale = 'en';
          console.log(count);
          // > 1
      
          langs.locale = 'en';
          console.log(count);
          // > 1
          ```
         */
        set: function (value) {
            if (this._locale === value) {
                return;
            }
            this.update(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 替换语言标记
     *
     * @param code 代码
     * @param options 配置项
     * @example Language:replace() quoted
      ```js
      var langs = new h5i18n.Languages('cn');
      console.log(langs.replace("language.get('点击<!--{en}click-->')", 'en'));
      // > 'click'
  
      console.log(langs.replace("language.get(`点击<!--{en}click-->`)", 'en'));
      // > `click`
  
      console.log(langs.replace("language.get(`点击<!--{en}click-->`)"));
      // > `点击`
  
      console.log(langs.replace("language.get(\"点击<!--{en}click-->\")", 'en'));
      // > "click"
      ```
     * @example Language:replace() title
      ```js
      var langs = new h5i18n.Languages('cn');
      console.log(langs.replace('<title data-lang-content="<!--{en}example--><!--{jp}サンプル-->">示例</title>', 'jp'));
      // > <title>サンプル</title>
  
      console.log(langs.replace('<title data-a="start" data-lang-content="<!--{en}example--><!--{jp}サンプル-->" data-b="end">示例</title>', 'jp'));
      // > <title data-a="start" data-b="end">サンプル</title>
      ```
     * @example Language:replace() attribute
      ```js
      var langs = new h5i18n.Languages('cn');
      console.log(langs.replace('<img src="cn.png" data-lang-src="<!--{jp}jp.png--><!--{en}en.png-->">', 'jp'));
      // > <img src="jp.png">
  
      console.log(langs.replace('<img src="cn.png"title="标志"data-lang-title="<!--{jp}標識--><!--{en}logo-->"data-lang-src="<!--{jp}jp.png--><!--{en}en.png-->">', 'jp'));
      // > <img src="jp.png"title="標識">
      ```
     * @example Language:replace() inner html
      ```js
      var langs = new h5i18n.Languages('cn');
      console.log(langs.replace('<span>中文<!--{en}English--><!--{jp}日本語--></span>', 'jp'));
      // > <span>日本語</span>
  
      console.log(langs.replace('<div title="中文" data-lang-title="<!--{jp}日本語--><!--{en}English-->"><div>中文<!--{en}English--><!--{jp}日本語--></div></div>', 'jp'));
      // > <div title="日本語"><div>日本語</div></div>
      ```
     * @example Language:replace() map
      ```js
      var langs = new h5i18n.Languages('cn');
      langs.dictionary({
        language: '<!--{en}English--><!--{jp}日本語-->'
      });
      console.log(langs.replace('<span>中文<!--{*}language--></span>', 'jp'));
      // > <span>日本語</span>
      ```
     * @example Language:replace() coverage
      ```js
      var langs = new h5i18n.Languages('cn');
      console.log(langs.replace('<span sa-data-lang-title="中文">', 'jp'));
      // > <span sa-data-lang-title="中文">
  
      console.log(langs.replace('中文<!--{en}English--><!--{jp}日本語--></span>', 'jp'));
      // > 中文<!--{en}English--><!--{jp}日本語--></span>
      ```
     * @example Language:replace() case1
      ```js
      var langs = new h5i18n.Languages('cn');
      console.log(langs.replace('console.info(languages.get("中文<!--{en}English-->"))', 'en'));
      // > console.info("English")
      ```
     * @example Language:replace() callback code
      ```js
      var langs = new h5i18n.Languages('cn');
      var log = '';
      langs.replace('console.info(languages.get("中文<!--{en}English-->"))', 'en', function (type, text) {
        log += 'type:' + type + ' text:' + text
      });
      console.log(log);
      // > type:code text:中文<!--{en}English-->
      ```
     * @example Language:replace() callback attribute
      ```js
      var langs = new h5i18n.Languages('cn');
      var log = '';
      langs.replace('<div title="中文" data-lang-title="<!--{jp}日本語--><!--{en}English-->"></div>', 'en', function (type, text) {
        log += 'type:' + type + ' text:' + text
      });
      console.log(log);
      // > type:attribute text:中文<!--{jp}日本語--><!--{en}English-->
      ```
     * @example Language:replace() callback element
      ```js
      var langs = new h5i18n.Languages('cn');
      var log = '';
      langs.replace('<div>中文<!--{en}English--><!--{jp}日本語--></div>', 'en', function (type, text) {
        log += 'type:' + type + ' text:' + text
      });
      console.log(log);
      // > type:element text:中文<!--{en}English--><!--{jp}日本語-->
      ```
     * @example Language:replace() callback title
      ```js
      var langs = new h5i18n.Languages('cn');
      var log = '';
      langs.replace('<title data-lang-content="<!--{en}example--><!--{jp}サンプル-->">示例</title>', 'en', function (type, text) {
        log += 'type:' + type + ' text:' + text
      });
      console.log(log);
      // > type:title text:示例<!--{en}example--><!--{jp}サンプル-->
      ```
     * @example Language:replace() callback code expr
      ```js
      var langs = new h5i18n.Languages('cn');
      var text = langs.replace('console.info(languages.get("中文<!--{en}English-->"))', 'en', function (type, text) {
        var expr = langs.parse(text);
        expr.optionsLang['en'] = 'English!!';
        return expr;
      });
      console.log(text);
      // > console.info(languages.get("English!!<!--{cn}中文-->"))
  
      var text = langs.replace('console.info(languages.get("中文<!--{en}English-->"))', 'en', function (type, text) {
        return false;
      });
      console.log(text);
      // > console.info(languages.get("中文<!--{en}English-->"))
      ```
     * @example Language:replace() callback attribute expr
      ```js
      var langs = new h5i18n.Languages('cn');
      var text = langs.replace('<div title="中文" class="box" data-lang-title="<!--{jp}日本語--><!--{en}English-->"></div>', 'jp', function (type, text) {
        var expr = langs.parse(text);
        expr.optionsLang['en'] = 'English!!';
        expr.optionsLang['ne'] = '🔥';
        return expr;
      });
      console.log(text);
      // > <div title="日本語" data-lang-title="<!--{en}English!!--><!--{cn}中文--><!--{ne}🔥-->" class="box"></div>
  
      var text = langs.replace('<div title="中文" class="box" data-lang-title="<!--{jp}日本語--><!--{en}English-->"></div>', 'jp', function (type, text) {
        return false;
      });
      console.log(text);
      // > <div title="中文" class="box" data-lang-title="<!--{jp}日本語--><!--{en}English-->"></div>
      ```
     * @example Language:replace() callback title expr
      ```js
      var langs = new h5i18n.Languages('cn');
      var text = langs.replace('<title data-lang-content="<!--{en}example--><!--{jp}サンプル-->">示例</title>', 'en', function (type, text) {
        var expr = langs.parse(text);
        expr.optionsLang['ne'] = '🔥';
        return expr;
      });
      console.log(text);
      // > <title data-lang-content="<!--{jp}サンプル--><!--{cn}示例--><!--{ne}🔥-->">example</title>
  
      var text = langs.replace('<title data-lang-content="<!--{en}example--><!--{jp}サンプル-->">示例</title>', 'en', function (type, text) {
        return false;
      });
      console.log(text);
      // > <title data-lang-content="<!--{en}example--><!--{jp}サンプル-->">示例</title>
      ```
     * @example Language:replace() callback element expr
      ```js
      var langs = new h5i18n.Languages('cn');
      var text = langs.replace('<div>中文<!--{en}English--><!--{jp}日本語--></div>', 'en', function (type, text) {
        var expr = langs.parse(text);
        expr.optionsLang['ne'] = '🔥';
        return expr;
      });
      console.log(text);
      // > <div>English<!--{jp}日本語--><!--{cn}中文--><!--{ne}🔥--></div>
  
      var text = langs.replace('<div>中文<!--{en}English--><!--{jp}日本語--></div>', 'en', function (type, text) {
        return false;
      });
      console.log(text);
      // > <div>中文<!--{en}English--><!--{jp}日本語--></div>
      ```
     */
    Languages.prototype.replace = function (code, locale, callback) {
        var _this = this;
        if (!locale) {
            locale = this.locale;
        }
        code = String(code).replace(/((?:(?:\w+\.)+)get)\((['"`])(.*?-->)\2\)/g, function (all, prefix, quoted, text) {
            // console.log(h5i18n.get('中国<!--{en}China--><!--{jp}中国--><!--{fr}Chine-->'))
            if (callback) {
                var expr = callback('code', text);
                if (expr === false) {
                    return all;
                }
                else if (expr) {
                    var text_1 = _this.build(locale, expr, true);
                    return prefix + "(" + quoted + text_1 + quoted + ")";
                }
            }
            return quoted + _this.get(text, locale) + quoted;
        }).replace(/<title(?=\s)((?:"[^"]*"|'[^']*'|[^'"<>])*?)\s+data-lang-content=('|")(.*?)\2((?:"[^"]*"|'[^']*'|[^'"<>])*)>([^]*?)<\/title>/g, function (all, start, quoted, attr, end, content) {
            if (callback) {
                var expr = callback('title', content + attr);
                if (expr === false) {
                    return all;
                }
                else if (expr) {
                    var temp = _this.build(locale, expr, true);
                    var index = temp.indexOf('<!--');
                    var left = temp.slice(0, index);
                    var right = temp.slice(index);
                    return "<title data-lang-content=" + quoted + right + quoted + start + end + ">" + left + "</title>";
                }
            }
            return "<title" + start + end + ">" + _this.get(content + attr, locale) + "</title>";
        }).replace(/<(?!title\s)("[^"]*"|'[^']*'|[^'"<>])+(data-lang-\w+)("[^"]*"|'[^']*'|[^'"<>])+>/g, function (all) {
            // <input type="text" placeholder="中文" data-lang-placeholder="<!--{en}English--><!--{jp}日本語-->">
            var dict = {};
            var result = all.replace(/((?:\s*)(?:[\w-])*)data-lang((?:-\w+)+)\s*=\s*(['"])([^]*?)(\3)/g, function (all, space, attr, quoted, text) {
                if (space.trim()) {
                    return all;
                }
                dict[attr.slice(1)] = text;
                return space.trim();
            });
            var fixed = 0;
            var keys = Object.keys(dict);
            keys.forEach(function (attr) {
                result = result.replace(new RegExp('([\'"\\s]' + attr + '\\s*=\\s*)([\'"])([^]*?)(\\2)', 'g'), function (all, prefix, quoted, text) {
                    if (callback) {
                        var expr = callback('attribute', text + dict[attr]);
                        if (expr === false) {
                            fixed++;
                            return "" + prefix + quoted + text + quoted + " data-lang-" + attr + "=" + quoted + dict[attr] + quoted;
                        }
                        else if (expr) {
                            var temp = _this.build(locale, expr, true);
                            var index = temp.indexOf('<!--');
                            var left = temp.slice(0, index);
                            var right = temp.slice(index);
                            return "" + prefix + quoted + left + quoted + " data-lang-" + attr + "=" + quoted + right + quoted;
                        }
                    }
                    return prefix + quoted + _this.get(text + dict[attr], locale) + quoted;
                });
            });
            if (fixed === keys.length) {
                return all;
            }
            else {
                return result;
            }
        });
        var offset = 0;
        var result = '';
        do {
            // <span>中文<!--{en}English--><!--{jp}日本語--></span>
            var match = code.slice(offset).match(/((?:<!--\{(?:[\w*]+)\}.*?-->\s*)+)(<\/(\w+)>)/);
            if (!match) {
                result += code.slice(offset);
                break;
            }
            var tag = match[3];
            var text = match[1];
            var left = RegExp['$`'];
            var right = match[2];
            var matchSub = left.match(new RegExp("<(" + tag + ")(?:\"[^\"]*\"|'[^']*'|[^\"'>])*>(?![^]*<\\1(?:\"[^\"]*\"|'[^']*'|[^\"'>])*>)"));
            if (!matchSub) {
                result += code.slice(offset);
                break;
            }
            offset += match.index + match[0].length;
            text = RegExp["$'"] + text;
            left = left.slice(0, matchSub.index) + matchSub[0];
            if (callback) {
                var expr = callback('element', text);
                if (expr === false) {
                    return left + text + right;
                }
                else if (expr) {
                    result += left + this.build(locale, expr, true) + right;
                    continue;
                }
            }
            result += left + this.get(text, locale) + right;
        } while (true);
        return result;
    };
    return Languages;
}(Emitter_1.Emitter)); /*</function>*/
exports.Languages = Languages;
