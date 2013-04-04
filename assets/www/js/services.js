'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('grit.services', ['ngResource'])
  .value('version', '0.1')
  .factory('Quiz', function($resource){
     return $resource('content/quiz.json', {}, {
       query: {method:'GET', params:{id:'1'}, isArray:true}
     });
  });
