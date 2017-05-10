(function (exportName) {
  /*<function name="createEmitter">*/
/**
 * @file h5emitter
 * @url https://github.com/zswang/h5emitter.git
 * event emitter function
 * @author
 *   zswang (http://weibo.com/zswang)
 * @version 0.0.11
 * @date 2017-05-08
 * @license MIT
 */
/**
 * 创建事件对象
 '''<example>'''
 * @example base
  ```js
  var emitter = h5emitter.createEmitter();
  emitter.on('click', function (data) {
    console.log('on', data);
  });
  emitter.once('click', function (data) {
    console.log('once', data);
  });
  function bee(data) {
    console.log('bee', data);
  }
  emitter.on('click', bee);
  emitter.on('click2', function (data) {
    console.log('on', data);
  });
  emitter.emit('click2', 'hello 1');
  // > on hello 1
  emitter.emit('click', 'hello 1');
  // > on hello 1
  // > once hello 1
  // > bee hello 1
  emitter.emit('click', 'hello 2');
  // > on hello 2
  // > bee hello 2
  emitter.off('click', bee);
  emitter.emit('click', 'hello 3');
  // > on hello 3
  ```
 '''</example>'''
 */
function createEmitter() {
    /**
     * 事件对象实例
     *
     * @type {Object}
     */
    var instance;
    /**
     * 事件列表
     */
    var callbacks = [];
    /**
     * 事件绑定
     *
     * @param event 事件名
     * @param fn 回调函数
     * @return 返回事件实例
     */
    function on(event, fn) {
        callbacks.push({
            event: event,
            fn: fn,
        });
        return instance;
    }
    /**
     * 取消事件绑定
     *
     * @param event 事件名
     * @param fn 回调函数
     * @return返回事件实例
     */
    function off(event, fn) {
        callbacks = callbacks.filter(function (item) {
            return !(item.event === event && item.fn === fn);
        });
        return instance;
    }
    /**
     * 事件绑定，只触发一次
     *
     * @param event 事件名
     * @param fn 回调函数
     * @return 返回事件实例
     */
    function once(event, fn) {
        function handler() {
            off(event, handler);
            fn.apply(instance, arguments);
        }
        on(event, handler);
        return instance;
    }
    /**
     * 触发事件
     *
     * @param event 事件名
     * @param fn 回调函数
     * @return 返回事件实例
     */
    function emit(event) {
        var argv = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            argv[_i - 1] = arguments[_i];
        }
        callbacks.filter(function (item) {
            return item.event === event;
        }).forEach(function (item) {
            item.fn.apply(instance, argv);
        });
        return instance;
    }
    instance = {
        emit: emit,
        on: on,
        off: off,
        once: once,
    };
    return instance;
} /*</function>*/
  /*<function name="Languages">*/
/**
 * @file h5i18n
 * @url https://github.com/zswang/h5i18n.git
 * A mobile page of internationalization development framework
 * @author
 *   zswang (http://weibo.com/zswang)
 * @version 0.3.5
 * @date 2017-05-10
 * @license MIT
 */
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
        this._emitter = createEmitter();
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
     * @example i18n():default key
      ```js
      var langs = new h5i18n.Languages('cn');
      langs.i18n({
        'click': '点击<!--{en}click--><!--{jp}クリックします-->',
        'dblclick': '双击<!--{en}Double click--><!--{jp}ダブルクリック-->',
      });
      console.log(langs.get('click<!--{*}-->'));
      // > 点击
      console.log(langs.get('click<!--{*}-->', 'jp'));
      // > クリックします
      console.log(langs.get('none<!--{*}-->'));
      // > none
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
        text = String(text).replace(/<!--\{([\w-]+)\}-->([^]*?)<!--\/\{\1\}-->|<!--\{([\w-]+|\*)\}([^]*?)-->/g, function (all, currentLang, currentText, optionLang, optionText) {
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
                t_1 = this.parse(this._i18ns[text]);
            }
            else {
                t_1 = this.parse(this._i18ns[result.optionsLang['*']]);
            }
            if (t_1) {
                Object.keys(t_1.optionsLang).forEach(function (key) {
                    result.optionsLang[key] = t_1.optionsLang[key];
                });
                result.currentLang = result.currentLang || t_1.currentLang;
                result.currentText = result.currentText || t_1.currentText;
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
            var text = langExpression.optionsLang[this._defaultLang] || '';
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
            node.innerHTML = _this.build(_lang, processTexts[index]);
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
        if (langExpression.optionsLang[lang] !== undefined) {
            return langExpression.optionsLang[lang];
        }
        if (langExpression.defaultText !== undefined) {
            return langExpression.defaultText;
        }
        return langExpression.optionsLang[this._defaultLang];
    };
    return Languages;
}()); /*</function>*/
  var exports = {
      Languages: Languages
  };
  /* istanbul ignore next */
  if (typeof define === 'function') {
    if (define.amd || define.cmd) {
      define(function() {
        return exports;
      });
    }
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = exports;
  } else {
    window[exportName] = exports;
  }
})('h5i18n');