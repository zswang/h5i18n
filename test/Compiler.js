
global.compiler = require('../lib/compiler.js');
global.h5i18n = require('../h5i18n.js');
      

describe("src/ts/Compiler.ts", function () {
  var assert = require('should');
  var util = require('util');
  var examplejs_printLines;
  function examplejs_print() {
    examplejs_printLines.push(util.format.apply(util, arguments));
  }
  
  

  it("Compiler.replace(): quoted", function () {
    examplejs_printLines = [];
    examplejs_print(compiler.Compiler.replace("language.get('点击<!--{en}click-->')", {
      locale: 'en'
    }));
    assert.equal(examplejs_printLines.join("\n"), "'click'"); examplejs_printLines = [];

    examplejs_print(compiler.Compiler.replace("language.get(`点击<!--{en}click-->`)", {
      locale: 'en'
    }));
    assert.equal(examplejs_printLines.join("\n"), "`click`"); examplejs_printLines = [];

    examplejs_print(compiler.Compiler.replace("language.get(\"点击<!--{en}click-->\")", {
      locale: 'en'
    }));
    assert.equal(examplejs_printLines.join("\n"), "\"click\""); examplejs_printLines = [];
  });
          
  it("Compiler.replace(): title", function () {
    examplejs_printLines = [];
    examplejs_print(compiler.Compiler.replace('<title data-lang-content="<!--{en}example--><!--{jp}サンプル-->">示例</title>', {
      locale: 'jp'
    }));
    assert.equal(examplejs_printLines.join("\n"), "<title>サンプル</title>"); examplejs_printLines = [];

    examplejs_print(compiler.Compiler.replace('<title data-a="start" data-lang-content="<!--{en}example--><!--{jp}サンプル-->" data-b="end">示例</title>', {
      locale: 'jp'
    }));
    assert.equal(examplejs_printLines.join("\n"), "<title data-a=\"start\" data-b=\"end\">サンプル</title>"); examplejs_printLines = [];
  });
          
  it("Compiler.replace(): attribute", function () {
    examplejs_printLines = [];
    examplejs_print(compiler.Compiler.replace('<img src="cn.png" data-lang-src="<!--{jp}jp.png--><!--{en}en.png-->">', {
      locale: 'jp'
    }));
    assert.equal(examplejs_printLines.join("\n"), "<img src=\"jp.png\">"); examplejs_printLines = [];

    examplejs_print(compiler.Compiler.replace('<img src="cn.png"title="标志"data-lang-title="<!--{jp}標識--><!--{en}logo-->"data-lang-src="<!--{jp}jp.png--><!--{en}en.png-->">', {
      locale: 'jp'
    }));
    assert.equal(examplejs_printLines.join("\n"), "<img src=\"jp.png\"title=\"標識\">"); examplejs_printLines = [];
  });
          
  it("Compiler.replace(): inner html", function () {
    examplejs_printLines = [];
    examplejs_print(compiler.Compiler.replace('<span>中文<!--{en}English--><!--{jp}日本語--></span>', {
      locale: 'jp'
    }));
    assert.equal(examplejs_printLines.join("\n"), "<span>日本語</span>"); examplejs_printLines = [];

    examplejs_print(compiler.Compiler.replace('<div title="中文" data-lang-title="<!--{jp}日本語--><!--{en}English-->"><div>中文<!--{en}English--><!--{jp}日本語--></div></div>', {
      locale: 'jp'
    }));
    assert.equal(examplejs_printLines.join("\n"), "<div title=\"日本語\"><div>日本語</div></div>"); examplejs_printLines = [];
  });
          
  it("Compiler.replace(): map", function () {
    examplejs_printLines = [];
    examplejs_print(compiler.Compiler.replace('<span>中文<!--{*}language--></span>', {
      locale: 'jp',
      map: {
        language: '<!--{en}English--><!--{jp}日本語-->'
      }
    }));
    assert.equal(examplejs_printLines.join("\n"), "<span>日本語</span>"); examplejs_printLines = [];
  });
          
  it("Compiler.replace(): coverage", function () {
    examplejs_printLines = [];
    examplejs_print(compiler.Compiler.replace('<span sa-data-lang-title="中文">', {
      locale: 'jp',
    }));
    assert.equal(examplejs_printLines.join("\n"), "<span sa-data-lang-title=\"中文\">"); examplejs_printLines = [];

    examplejs_print(compiler.Compiler.replace('中文<!--{en}English--><!--{jp}日本語--></span>', {
      locale: 'jp',
    }));
    assert.equal(examplejs_printLines.join("\n"), "中文<!--{en}English--><!--{jp}日本語--></span>"); examplejs_printLines = [];

    compiler.Compiler();
  });
          
  it("Compiler.replace(): case1", function () {
    examplejs_printLines = [];
    examplejs_print(compiler.Compiler.replace('console.info(languages.get("中文<!--{en}English-->"))', {
      locale: 'en',
    }));
    assert.equal(examplejs_printLines.join("\n"), "console.info(\"English\")"); examplejs_printLines = [];
  });
          
});
         