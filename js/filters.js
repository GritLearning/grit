'use strict';

angular.module('filters', ['underscore'])
  .filter('range', function() {
    return function (input, min, max) {
      min = parseInt(min, 10);
      max = parseInt(max, 10);
      for (var i = min; i < max; i = i+1) {
        input.push(i);
      }
      return input;
    };
  });

