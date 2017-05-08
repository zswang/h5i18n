"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Emitter_1 = require("h5emitter/src/ts/Emitter");
/*<function name="Languages">*/
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
 * @example Languages:attr
  ```html
  <img src="img/cn.png" data-lang-src="<!--{en}img/en.png-->">
  <img src="img/cn.png" data-lang-src="<!--{cn}img/cn.png--><!--{en}img/en.png-->">
  <img src="img/cn.png" data-lang-src="none">
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
  <span>中文1<!--{en}English1--></span>
  <span>中文2<!--{en}English2--></span>
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
  <div>
    <span>中文<!--{en}English--></span>
    empty<!--empty-->
  </div>
  ```
  ```js
  var langs = new h5i18n.Languages('cn');
  var div = document.querySelector('div');
  langs.update('en');

  console.log(JSON.stringify(div.innerHTML));
  // > "\n    <span><!--{en}-->English<!--/{en}--><!--{cn}中文--></span>\n    empty<!--empty-->\n  "
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
  // > <!--{en}-->
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
 */
var Languages = (function () {
    /**
     * 构造多语言工具
     *
     * @param lang 语言
     */
    function Languages(_defaultLang, _attrs) {
        if (_defaultLang === void 0) { _defaultLang = 'cn'; }
        this._defaultLang = _defaultLang;
        this._currentLang = _defaultLang;
        this._attrs = _attrs || languages_attrs;
        this._i18ns = {};
        this._emitter = Emitter_1.createEmitter();
    }
    /**
     * 增加语言字典
     *
     * @param blos 语言字典
     * @example i18n():base
      ```js
      var langs = new h5i18n.Languages('cn');
      langs.i18n({
        'click': '点击<!--{en}click--><!--{jp}クリックします-->',
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
  
      langs.i18n();
      console.log(langs.get('空<!--{*}none-->'));
      // > 空
  
      console.log(langs.get('无设置'));
      // > 无设置
      ```
     */
    Languages.prototype.i18n = function (blos) {
        var _this = this;
        if (!blos) {
            return;
        }
        Object.keys(blos).forEach(function (key) {
            _this._i18ns[key] = blos[key];
        });
    };
    Languages.prototype.on = function (event, fn) {
        this._emitter.on(event, fn);
        return this;
    };
    Languages.prototype.once = function (event, fn) {
        this._emitter.once(event, fn);
        return this;
    };
    Languages.prototype.off = function (event, fn) {
        this._emitter.off(event, fn);
        return this;
    };
    /**
     * 解析文本为语言表达式
     *
     * @param text 文本
     */
    Languages.prototype.parse = function (text) {
        var result = {
            optionsLang: {},
            currentLang: null,
            currentText: null,
        };
        var find;
        text = String(text).replace(/<!--\{([\w-]+)\}-->([^]+?)<!--\/\{\1\}-->|<!--\{([\w-]+|\*)\}([^]+?)-->/g, function (all, currentLang, currentText, optionLang, optionText) {
            find = true;
            if (currentLang) {
                result.currentLang = currentLang;
                result.currentText = currentText;
                result.optionsLang[currentLang] = currentText;
            }
            else {
                result.optionsLang[optionLang] = optionText;
            }
            return '';
        });
        if (!find) {
            return null;
        }
        if (result.optionsLang['*']) {
            var t = this.parse(this._i18ns[result.optionsLang['*']]);
            if (t) {
                Object.keys(t.optionsLang).forEach(function (key) {
                    result.optionsLang[key] = t.optionsLang[key];
                });
                result.currentLang = result.currentLang || t.currentLang;
                result.currentText = result.currentText || t.currentText;
            }
        }
        text = text.trim();
        if (text) {
            result.defaultText = text;
            if (!result.optionsLang[this._defaultLang]) {
                result.optionsLang[this._defaultLang] = text;
            }
        }
        return result;
    };
    /**
     * 将语言表达式编译为文本
     *
     * @param _lang 语言
     * @param langExpression 语言表达式对象
     */
    Languages.prototype.build = function (_lang, langExpression) {
        var result = '';
        Object.keys(langExpression.optionsLang).forEach(function (lang) {
            var text = langExpression.optionsLang[lang];
            if (lang === _lang) {
                result += "<!--{" + lang + "}-->" + text + "<!--/{" + lang + "}-->";
            }
            else {
                result += "<!--{" + lang + "}" + text + "-->";
            }
        });
        if (!langExpression.optionsLang[_lang]) {
            var lang = this._defaultLang;
            var text = langExpression.optionsLang[this._defaultLang];
            result += "<!--{" + lang + "}-->" + text + "<!--/{" + lang + "}-->";
        }
        return result;
    };
    /**
     * 更新语言
     *
     * @param lang 语言
     * @param parent 更新的节点，默认为全部
     */
    Languages.prototype.update = function (_lang, parent) {
        var _this = this;
        _lang = _lang || this._currentLang;
        if (this._currentLang !== _lang) {
            this._currentLang = _lang;
            this._emitter.emit('change', _lang);
        }
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
            if (processTexts[index]) {
                node.innerHTML = _this.build(_lang, processTexts[index]);
            }
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
                element.setAttribute(langAttr, _this.build(_lang, langExpression));
                element.setAttribute(attr, langExpression.optionsLang[_lang] ||
                    langExpression.optionsLang[_this._defaultLang]);
            });
        });
    };
    Languages.prototype.get = function (langText, lang) {
        lang = lang || this._currentLang;
        var langExpression = this.parse(langText);
        if (!langExpression) {
            return langText;
        }
        return langExpression.optionsLang[lang] ||
            langExpression.defaultText ||
            langExpression.optionsLang[this._defaultLang];
    };
    return Languages;
}()); /*</function>*/
exports.Languages = Languages;
