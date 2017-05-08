(function (exportName) {
  /*<jdists import="../node_modules/h5emitter/h5emitter.js" encoding="fndep" depend="createEmitter" />*/
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