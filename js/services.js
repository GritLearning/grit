'use strict';

// Services

var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
    return window._; // assumes underscore has already been loaded on the page
  });


angular.module('grit.services', ['ngResource', 'ngStorage'])
  .factory('Player', function($resource, $localStorage, $log) {
    var level = 1;
    var player = [];
    
    $resource.addPlayer = function(kid) {
        $resource.getPlayer;
        $log.log(player);
        player.push(kid);
        $localStorage.player = JSON.stringify(player);
        $resource.getFirstLevel();
        return 'added player';
    };
    $resource.rmPlayer = function() {
        $resource.getPlayer;
        player.pop();
        $localStorage.player = JSON.stringify(player);
        return 'removed player';
    };
    $resource.getPlayer = function() {
        if($localStorage.player){
            player = JSON.parse($localStorage.player);
        }
        return player;
    };
    $resource.getFirstLevel = function() {
        $resource.getPlayer;
        $log.log(player);

        angular.forEach(player, function(value){
            if(value.level > level){
              level = value.level;
            }
        });
        $log.log("Level: " + level);
        return level;
    };
    $resource.getLevel = function() {
        return level;
    };
    return $resource; // returning this is very important
  })
  .factory('Result', function($resource, $log) {
    var result = [];

    $resource.addResult = function(quiz, answer) {
      if (quiz.correct == answer) {
        result.push(1);
        if ((result.length % 2) == 1) {
          result.push(1);
        }
        return 1;
      } else {
        result.push(0);
        return 0;
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
      if ((right * 100)/count >= 70) {
        return 'passed';
      } else {
        return 'failed';
      }
      };
    return $resource; // returning this is very important
  });
