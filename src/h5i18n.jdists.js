(function (exportName) {
  /*<jdists encoding="fndep" import="./js/Languages.js" depend="Languages" />*/

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