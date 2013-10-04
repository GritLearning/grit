'use strict';

/* Directives */

angular.module('grit.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  directive('enableFitText', function () {
    return function(scope, element, attrs) {
      // console.log('running text tweaking algorithm');
      // debugger;
      // $(element).fitText(1.2, { minFontSize: '60px', maxFontSize: '200px' });
      // $(element).fitText();
    };
  });
