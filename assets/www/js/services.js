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
    .factory('Result', function($resource) {
    	var result = [];
    	$resource.addResult = function(quiz, answer) {
    		if (quiz.correct == answer) {
    			result.push(1);
    		} else {
    			result.push(0);
    		}
    		return 'push result';
    	};
    	$resource.getResult = function() {
    		return result;
    	};
    	$resource.removeAll = function() {
    		result = [];
    	};
    	$resource.getConclusionResult = function() {
    		var count = 0;
    		var wrong = 0;
    		var right = 0;
    		angular.forEach(result, function(value) {
    			count ++;
    			if (value) {
    				right ++;
    			} else {
    				wrong ++;
    			}
    		});
    		// result up to 60% correct will be passed
    		if ((right * 100)/count > 60) {
    			return 'passed';
    		} else {
    			return 'failed';
    		}
        };
    	return $resource; // returning this is very important
    })
  .factory('Quiz', function($resource){
	  return $resource('content/quiz_en.json', {}, {
	       query: {method:'GET', params:{id:'1'}, isArray:true}
      });
});
