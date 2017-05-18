interface LangExpression {
  /**
   * 备选语言
   */
  optionsLang: { [key: string]: string }
  /**
   * 当前语言
   */
  locale: string
  /**
   * 当前内容
   */
  localeText: string

  /**
   * 默认内容
   */
  defaultText?: string
}

import { Emitter, createEmitter } from 'h5emitter/src/ts/Emitter'

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
let languages_attrs = ['alt', 'src', 'title', 'value', 'placeholder', 'label']

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
class Languages {

  /**
   * 默认语言
   */
  _defaultLocale: string

  /**
   * 当前语言
   */
  _locale: string

  /**
   * 语言相关属性
   */
  _attrs: string[]

  /**
   * 语言字典
   */
  _dictionarys: { [key: string]: string }

  _emitter: Emitter;

  /**
   * 增加语言字典
   *
   * @param blos 语言字典
   * @example i18n():base
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
   * @example i18n():default key
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
  dictionary(blos: { [key: string]: string }) {
    if (!blos) {
      return
    }
    Object.keys(blos).forEach((key) => {
      this._dictionarys[key] = blos[key]
    })
  }

  /**
   * 构造多语言工具
   *
   * @param _defaultLocale 默认语言
   * @param _attrs 替换的属性列表
   */
  constructor(_defaultLocale = 'cn', _attrs: string[]) {
    this._defaultLocale = _defaultLocale
    this._locale = _defaultLocale

    this._attrs = _attrs || languages_attrs
    this._dictionarys = {}
    this._emitter = createEmitter()
  }

  on(event: string, fn: Function) {
    this._emitter.on(event, fn)
    return this
  }

  once(event: string, fn: Function) {
    this._emitter.once(event, fn)
    return this
  }

  off(event: string, fn: Function) {
    this._emitter.off(event, fn)
    return this
  }

  /**
   * 解析文本为语言表达式
   *
   * @param text 文本
   */
  parse(text: string): LangExpression {
    let result: LangExpression = {
      optionsLang: {},
      locale: null,
      localeText: null,
    }

    let find: boolean

    text = String(text).replace(
      /<!--\{([\w-]+)\}-->([^]*?)<!--\/\{\1\}-->|<!--\{([\w-]+|\*)\}([^]*?)-->/g,
      (all, locale, localeText, optionLang, optionText) => {
        find = true
        if (locale) {
          result.locale = locale
          result.localeText = localeText
          result.optionsLang[locale] = localeText
        } else {
          result.optionsLang[optionLang] = optionText
        }
        return ''
      }
    )

    if (!find) {
      return null
    }

    text = text.trim()
    if (text) {
      result.defaultText = text
      if (!result.optionsLang[this._defaultLocale]) {
        result.optionsLang[this._defaultLocale] = text
      }
    }

    if (result.optionsLang['*'] !== undefined) {
      let t: LangExpression;
      if (result.optionsLang['*'] === '') {
        t = this.parse(this._dictionarys[text])
      } else {
        t = this.parse(this._dictionarys[result.optionsLang['*']])
      }
      if (t) {
        Object.keys(t.optionsLang).forEach((key) => {
          result.optionsLang[key] = t.optionsLang[key]
        })
        result.locale = result.locale || t.locale
        result.localeText = result.localeText || t.localeText
      }
    }

    return result
  }

  /**
   * 将语言表达式编译为文本
   *
   * @param _lang 语言
   * @param langExpression 语言表达式对象
   */
  build(_lang: string, langExpression: LangExpression): string {
    let result = ''

    Object.keys(langExpression.optionsLang).forEach((lang) => {
      let text = langExpression.optionsLang[lang]
      if (lang === _lang) {
        result += `<!--{${lang}}-->${text}<!--/{${lang}}-->`
      } else {
        result += `<!--{${lang}}${text}-->`
      }

    })
    if (!langExpression.optionsLang[_lang]) {
      let lang = this._defaultLocale
      let text = langExpression.optionsLang[this._defaultLocale] || ''
      result += `<!--{${lang}}-->${text}<!--/{${lang}}-->`
    }

    return result
  }

  /**
   * 更新语言
   *
   * @param lang 语言
   * @param parent 更新的节点，默认为全部
   */
  update(_locale?: string, parent?: Element | string) {
    _locale = _locale || this._locale

    if (this._locale !== _locale) {
      this._locale = _locale
      this._emitter.emit('change', _locale)
    }

    // run in node
    if (typeof document === 'undefined') {
      return
    }

    if (!parent) {
      parent = document.documentElement
    } else if (typeof parent === 'string') {
      parent = document.querySelector(parent)
    }

    // 处理文本节点
    let nodeIterator = document.createNodeIterator(
      (parent as Node), NodeFilter.SHOW_COMMENT, null, false
    )

    let processNodes = []
    let processTexts = []

    let node
    while ((node = nodeIterator.nextNode())) {

      if (processNodes.indexOf(node.parentNode) >= 0 || // 处理过
        /^(script|style|link)$/i.test(node.parentNode.nodeName) ||
        !(/^\{[\w-]+\}/.test(node.nodeValue))) {
        continue
      }
      processNodes.push(node.parentNode)
      processTexts.push(this.parse(node.parentNode.innerHTML))
    }

    processNodes.forEach((node, index) => {
      node.innerHTML = this.build(_locale, processTexts[index])
    })

    this._attrs.forEach((attr) => {
      let langAttr = `data-lang-${attr}`
      let elements = [].slice.call((parent as Element).querySelectorAll(`[${langAttr}]`))
      elements.forEach((element) => {
        let langText = element.getAttribute(langAttr)
        let langExpression = this.parse(langText)
        if (!langExpression) {
          return
        }
        if (!langExpression.optionsLang[this._defaultLocale]) {
          langExpression.optionsLang[this._defaultLocale] = element.getAttribute(attr)
        }
        element.setAttribute(langAttr, this.build(_locale, langExpression))
        element.setAttribute(attr,
          langExpression.optionsLang[_locale] ||
          langExpression.optionsLang[this._defaultLocale]
        )
      })
    })

  }

  /**
   * 获取表达式中的文字
   *
   * @param langText 表达式
   * @param locale 语言，默认为当前语言
   */
  get(langText: string, locale?: string) {
    locale = locale || this._locale

    let langExpression = this.parse(langText)
    if (!langExpression) {
      return langText
    }
    if (langExpression.optionsLang[locale] !== undefined) {
      return langExpression.optionsLang[locale]
    }
    if (langExpression.defaultText !== undefined) {
      return langExpression.defaultText
    }
    return langExpression.optionsLang[this._defaultLocale]
  }

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
  get locale() {
    return this._locale
  }

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
  set locale(value: string) {
    if (this._locale === value) {
      return
    }
    this.update(value)
  }

} /*</function>*/

export {
  Languages
}