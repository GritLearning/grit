'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('grit.services', ['ngResource'])
   .factory('Player', function($resource) {
      var player = [];
      var level = 1;
      
      $resource.addPlayer = function(kid) {
        player.push(kid);
        $resource.getFirstLevel();
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
          console.log(player);

          angular.forEach(player, function(value){
              if(value.level > level){
                level = value.level;
              }
          });
          console.log("Level: " + level);
          return level;
      };
    $resource.getLevel = function() {
        return level;
    };
      return $resource; // returning this is very important
    })
  .factory('Quiz', function($resource){
     /*return $resource('content/quiz.json', {}, {
       query: {method:'GET', params:{id:'1'}, isArray:true}
     });*/
	  var questions = $resource('content/quiz.json', {}, {
	       query: {method:'GET', params:{id:'1'}, isArray:true}
	     });
	  return questions;
	$resource.getQuestionBylevel = function(level) {
		
	}
  });
