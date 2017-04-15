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
/**
 * 翻译
 *
 * see @https://github.com/jaywcjlove/translater.js
 */
/*<function name="Languages">*/
let languages_attrs = ['alt', 'src', 'title', 'value', 'placeholder']

class Languages {

  /**
   * 当前语言
   */
  _lang: string

  /**
   * 默认语言
   */
  _defaultLang: string

  /**
   * 构造多语言工具
   *
   * @param lang 语言
   */
  constructor(_defaultLang: string = 'en') {
    this._defaultLang = _defaultLang
  }

  set lang(value: string) {
    if (this._lang === value) {
      return
    }
    this._lang = value
    this.update()
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
   * @param langExpression
   */
  build(langExpression: LangExpression): string {
    let result = ''

    Object.keys(langExpression.optionsLang).forEach((lang) => {
      let text = langExpression.optionsLang[lang]
      if (lang === this._lang) {
        result += `<!--{${lang}}-->${text}<!--/{${lang}}-->`
      } else {
        result += `<!--{${lang}}${text}-->`
      }

    })
    if (!langExpression.optionsLang[this._lang]) {
      let lang = this._defaultLang
      let text = langExpression.optionsLang[this._defaultLang]
      result += `<!--{${lang}}-->${text}<!--/{${lang}}-->`
    }

    return result
  }

  /**
   * 更新语言
   *
   * @param element 更新的节点，默认为全部
   */
  update(parent?: Element | string) {
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
        /^\s*$/.test(node.nodeValue)) {
        continue
      }
      processNodes.push(node.parentNode)
      processTexts.push(this.parse(node.parentNode.innerHTML))
    }

    processNodes.forEach((node, index) => {
      if (processTexts[index]) {
        node.innerHTML = this.build(processTexts[index])
      }
    })

    languages_attrs.forEach((attr) => {
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
        element.setAttribute(langAttr, this.build(langExpression))
        element.setAttribute(attr,
          langExpression.optionsLang[this._lang] ||
          langExpression.optionsLang[this._defaultLang]
        )
      });
    })

  }

} /*</function>*/

export {
  Languages
}