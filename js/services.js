// Services

angular.module('underscore', [])
  .factory('_', function() {
    'use strict';
    return window._; // assumes underscore has already been loaded as a global
  });
