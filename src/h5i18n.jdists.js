(function (exportName) {
  /*<jdists import="../node_modules/h5emitter/h5emitter.js" encoding="fndep" depend="Emitter" />*/

  /* istanbul ignore next */
  var __extends = (function () {
    /* jshint proto: true */
    var extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  })();

  /*<jdists encoding="fndep,regex" import="./js/Languages.js"
    depend="Languages" pattern="/Emitter_\d+\./g" replacement="" />*/

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