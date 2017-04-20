interface LangExpression {
  /**
   * 备选语言
   */
  optionsLang: { [key: string]: string }
  /**
   * 当前语言
   */
  currentLang: string
  /**
   * 当前内容
   */
  currentText: string

  /**
   * 默认内容
   */
  defaultText?: string
}

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
 */
class Languages {

  /**
   * 默认语言
   */
  _defaultLang: string

  /**
   * 当前语言
   */
  _currentLang: string

  /**
   * 语言相关属性
   */
  _attrs: string[]

  /**
   * 构造多语言工具
   *
   * @param lang 语言
   */
  constructor(_defaultLang = 'cn', _attrs: string[]) {
    this._defaultLang = _defaultLang
    this._currentLang = _defaultLang

    this._attrs = _attrs || languages_attrs;
  }

  /**
   * 解析文本为语言表达式
   *
   * @param text 文本
   */
  parse(text: string): LangExpression {
    let result: LangExpression = {
      optionsLang: {},
      currentLang: null,
      currentText: null,
    }

    let find

    text = String(text).replace(
      /<!--\{([\w-]+)\}-->([^]+?)<!--\/\{\1\}-->|<!--\{([\w-]+)\}([^]+?)-->/g,
      (all, currentLang, currentText, optionLang, optionText) => {
        find = true
        if (currentLang) {
          result.currentLang = currentLang
          result.currentText = currentText
          result.optionsLang[currentLang] = currentText
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
      if (!result.optionsLang[this._defaultLang]) {
        result.optionsLang[this._defaultLang] = text
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
      let lang = this._defaultLang
      let text = langExpression.optionsLang[this._defaultLang]
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
  update(_lang?: string, parent?: Element | string) {
    _lang = _lang || this._currentLang
    this._currentLang = _lang

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
      if (processTexts[index]) {
        node.innerHTML = this.build(_lang, processTexts[index])
      }
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
        if (!langExpression.optionsLang[this._defaultLang]) {
          langExpression.optionsLang[this._defaultLang] = element.getAttribute(attr)
        }
        element.setAttribute(langAttr, this.build(_lang, langExpression))
        element.setAttribute(attr,
          langExpression.optionsLang[_lang] ||
          langExpression.optionsLang[this._defaultLang]
        )
      });
    })

  }

} /*</function>*/

export {
  Languages
}