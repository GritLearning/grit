'use strict';

/* Directives */

angular.module('grit.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  directive('repeatDone', function() {
    return function(scope, element, attrs) {
      if (scope.$last) { // all are rendered
        scope.$eval(attrs.repeatDone); // evaluate our repeat-done attribute
      }
    }
  }).
  directive('enableFitText', function () {
    return function(scope, element, attrs) {
      // TODO: need to implement this
      // console.log('running text tweaking algorithm');
      // debugger;
      // $(element).fitText(1.2, { minFontSize: '60px', maxFontSize: '200px' });
      // $(element).fitText();
    };
  });
