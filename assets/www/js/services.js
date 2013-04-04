'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('grit.services', ['ngResource']).
    factory('Player', function($resource) {
      var player = [];
      
      $resource.addPlayer = function(kid) {
        player.push(kid);
        return 'added player';
      };
      $resource.rmPlayer = function() {
        player.pop();
        return 'removed player';
      };
      $resource.getPlayer = function() {
        return player;
      };
      $resource.getFirstLevel = function() {
          var level = 0;
          for(p in player){
              if(p.level > level){
                  level = p.level;
              }
          }
          console.log("Level: " + level);
          return level;
      };
      return $resource; // returning this is very important
    });
  factory('Quiz', function($resource){
     return $resource('content/quiz.json', {}, {
       query: {method:'GET', params:{id:'1'}, isArray:true}
     });
  });
