
global.h5i18n = require('../h5i18n.js');
      

describe("src/ts/Languages.ts", function () {
  var assert = require('should');
  var util = require('util');
  var examplejs_printLines;
  function examplejs_print() {
    examplejs_printLines.push(util.format.apply(util, arguments));
  }
  var jsdom = require('jsdom');
  

  it("jsdom@Languages:text default option", function (done) {
    jsdom.env("  <span>中文1<!--{en}English1--></span>\n  <span>中文2<!--{en}English2--></span>\n  <span>中文3<!--{en}English3--><!--{cn}中文3--></span>\n  <span>Hello<!--World!--></span>", {
        features: {
          FetchExternalResources : ["script", "link"],
          ProcessExternalResources: ["script"]
        }
      },
      function (err, window) {
        global.window = window;
        ["document","NodeFilter"].forEach(
          function (key) {
            global[key] = window[key];
          }
        );
        assert.equal(err, null);
        done();
      }
    );
  });
          
  it("Languages:text default option", function () {
    examplejs_printLines = [];
  var langs = new h5i18n.Languages();
  langs.update('en');

  var span1 = document.querySelector('span:nth-of-type(1)');
  examplejs_print(span1.innerHTML);
  assert.equal(examplejs_printLines.join("\n"), "<!--{en}-->English1<!--/{en}--><!--{cn}中文1-->"); examplejs_printLines = [];

  var span2 = document.querySelector('span:nth-of-type(2)');
  examplejs_print(span2.innerHTML);
  assert.equal(examplejs_printLines.join("\n"), "<!--{en}-->English2<!--/{en}--><!--{cn}中文2-->"); examplejs_printLines = [];

  langs.update(); // cn
  examplejs_print(span1.innerHTML);
  assert.equal(examplejs_printLines.join("\n"), "<!--{en}English1--><!--{cn}-->中文1<!--/{cn}-->"); examplejs_printLines = [];

  examplejs_print(span2.innerHTML);
  assert.equal(examplejs_printLines.join("\n"), "<!--{en}English2--><!--{cn}-->中文2<!--/{cn}-->"); examplejs_printLines = [];

  langs.update('none');
  examplejs_print(span1.innerHTML);
  assert.equal(examplejs_printLines.join("\n"), "<!--{en}English1--><!--{cn}中文1--><!--{cn}-->中文1<!--/{cn}-->"); examplejs_printLines = [];

  examplejs_print(span2.innerHTML);
  assert.equal(examplejs_printLines.join("\n"), "<!--{en}English2--><!--{cn}中文2--><!--{cn}-->中文2<!--/{cn}-->"); examplejs_printLines = [];
  });
          
  it("jsdom@Languages:attr", function (done) {
    jsdom.env("  <img src=\"img/cn.png\" data-lang-src=\"<!--{en}img/en.png-->\">\n  <img src=\"img/cn.png\" data-lang-src=\"<!--{cn}img/cn.png--><!--{en}img/en.png-->\">\n  <img src=\"img/cn.png\" data-lang-src=\"none\">", {
        features: {
          FetchExternalResources : ["script", "link"],
          ProcessExternalResources: ["script"]
        }
      },
      function (err, window) {
        global.window = window;
        ["document","NodeFilter"].forEach(
          function (key) {
            global[key] = window[key];
          }
        );
        assert.equal(err, null);
        done();
      }
    );
  });
          
  it("Languages:attr", function () {
    examplejs_printLines = [];
  var langs = new h5i18n.Languages('cn');
  langs.update('en');
  var img = document.querySelector('img');
  examplejs_print(img.getAttribute('src'));
  assert.equal(examplejs_printLines.join("\n"), "img/en.png"); examplejs_printLines = [];

  langs.update('none');
  var img = document.querySelector('img');
  examplejs_print(img.getAttribute('src'));
  assert.equal(examplejs_printLines.join("\n"), "img/cn.png"); examplejs_printLines = [];
  });
          
  it("jsdom@Languages:update default", function (done) {
    jsdom.env("  <span>中文1<!--{en}English1--></span>\n  <span>中文2<!--{en}English2--></span>", {
        features: {
          FetchExternalResources : ["script", "link"],
          ProcessExternalResources: ["script"]
        }
      },
      function (err, window) {
        global.window = window;
        ["document","NodeFilter"].forEach(
          function (key) {
            global[key] = window[key];
          }
        );
        assert.equal(err, null);
        done();
      }
    );
  });
          
  it("Languages:update default", function () {
    examplejs_printLines = [];
  var langs = new h5i18n.Languages('cn');
  var span1 = document.querySelector('span:nth-of-type(1)');
  langs.update('en', span1);

  examplejs_print(span1.innerHTML);
  assert.equal(examplejs_printLines.join("\n"), "<!--{en}-->English1<!--/{en}--><!--{cn}中文1-->"); examplejs_printLines = [];

  var span2 = document.querySelector('span:nth-of-type(2)');
  examplejs_print(span2.innerHTML);
  assert.equal(examplejs_printLines.join("\n"), "中文2<!--{en}English2-->"); examplejs_printLines = [];
  });
          
  it("jsdom@Languages:update selector", function (done) {
    jsdom.env("  <span>中文1<!--{en}English1--></span>\n  <span>中文2<!--{en}English2--></span>", {
        features: {
          FetchExternalResources : ["script", "link"],
          ProcessExternalResources: ["script"]
        }
      },
      function (err, window) {
        global.window = window;
        ["document","NodeFilter"].forEach(
          function (key) {
            global[key] = window[key];
          }
        );
        assert.equal(err, null);
        done();
      }
    );
  });
          
  it("Languages:update selector", function () {
    examplejs_printLines = [];
  var langs = new h5i18n.Languages('cn');
  var span1 = document.querySelector('span:nth-of-type(1)');
  langs.update('en', 'span:nth-of-type(1)');

  examplejs_print(span1.innerHTML);
  assert.equal(examplejs_printLines.join("\n"), "<!--{en}-->English1<!--/{en}--><!--{cn}中文1-->"); examplejs_printLines = [];

  var span2 = document.querySelector('span:nth-of-type(2)');
  examplejs_print(span2.innerHTML);
  assert.equal(examplejs_printLines.join("\n"), "中文2<!--{en}English2-->"); examplejs_printLines = [];
  });
          
});
         