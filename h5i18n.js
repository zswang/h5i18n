(function (exportName) {
  /*<function name="Languages">*/
var languages_attrs = ['alt', 'src', 'title', 'value', 'placeholder'];
var Languages = (function () {
    /**
     * 构造多语言工具
     *
     * @param lang 语言
     */
    function Languages(_defaultLang) {
        if (_defaultLang === void 0) { _defaultLang = 'en'; }
        this._defaultLang = _defaultLang;
    }
    Object.defineProperty(Languages.prototype, "lang", {
        set: function (value) {
            if (this._lang === value) {
                return;
            }
            this._lang = value;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
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
        text = String(text).replace(/<!--\{([\w-]+)\}-->([^]+?)<!--\/\{\1\}-->|<!--\{([\w-]+)\}([^]+?)-->/g, function (all, currentLang, currentText, optionLang, optionText) {
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
        return result;
    };
    /**
     * 将语言表达式编译为文本
     *
     * @param langExpression
     */
    Languages.prototype.build = function (langExpression) {
        var _this = this;
        var result = '';
        Object.keys(langExpression.optionsLang).forEach(function (lang) {
            var text = langExpression.optionsLang[lang];
            if (lang === _this._lang) {
                result += "<!--{" + lang + "}-->" + text + "<!--/{" + lang + "}-->";
            }
            else {
                result += "<!--{" + lang + "}" + text + "-->";
            }
        });
        if (!langExpression.optionsLang[this._lang]) {
            var lang = this._defaultLang;
            var text = langExpression.optionsLang[this._defaultLang];
            result += "<!--{" + lang + "}-->" + text + "<!--/{" + lang + "}-->";
        }
        return result;
    };
    /**
     * 更新语言
     *
     * @param element 更新的节点，默认为全部
     */
    Languages.prototype.update = function (parent) {
        var _this = this;
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
                /^\s*$/.test(node.nodeValue)) {
                continue;
            }
            processNodes.push(node.parentNode);
            processTexts.push(this.parse(node.parentNode.innerHTML));
        }
        processNodes.forEach(function (node, index) {
            if (processTexts[index]) {
                node.innerHTML = _this.build(processTexts[index]);
            }
        });
        languages_attrs.forEach(function (attr) {
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
                element.setAttribute(langAttr, _this.build(langExpression));
                element.setAttribute(attr, langExpression.optionsLang[_this._lang] ||
                    langExpression.optionsLang[_this._defaultLang]);
            });
        });
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