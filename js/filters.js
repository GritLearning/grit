// Filters

angular.module('grit.filters', ['underscore'])
  .filter('range', function() {
    'use strict';
    return function (input, min, max) {
      min = parseInt(min, 10);
      max = parseInt(max, 10);
      for (var i = min; i < max; i = i+1) {
        input.push(i);
      }
      return input;
    };
  });

