'use strict';

/* Controllers */

function RootCtrl($location, $localStorage, $log) {
  $log.log("in root controller");
  var level = $localStorage.level;

  if(level){
    $log.log("found level: " + level);
    $location.path('/level/' + level);
  } else {
    $location.path('/level/1');
    $log.log("found no level");
  }
}

function ExitCtrl($scope, $localStorage, $log) {
  $log.log("exiting");
  $scope.levelId = $localStorage.level;

  if($scope.levelId){
    $log.log("exit: found level: " + $scope.levelId);
  } else {
    $scope.levelId = 0;
    $log.log("exit: found no level");
  }
  // TODO: we need to remove the level storage to reset the app for next round of playing
  // $localStorage.$reset ??? - will reset *all* storage
}

function AdminCtrl($scope, Player) {
    $scope.closeGrit = function(){
        navigator.app.exitApp();
    };

    $scope.player = Player.getPlayer();
    $scope.settings = function() {
        cordova.exec(
            successHdl(),
            errorHdl(),
            "GritLauncher", 
            "startActivity", 
            [ 'com.android.settings' ]);
    };
}

function ContentListCtrl($scope, $http, $routeParams, Player, $localStorage, $log) {
    $http.get('content/apps/apps.json').success(function(data) {
        $scope.content = data;
    });

    $scope.filterByLevel = function(content) {
        if(content.level == $scope.levelId){
            return content;
        }
    };

    $scope.filterByLevelFromHere = function(content) {
        if(content.level > $scope.levelId){
            return content;
        }
    };

    $scope.levelId = Number($routeParams.levelId);
    $scope.player = Player.getPlayer();

    $scope.open = function(app, name) {
        $log.log("open: " + name);
        $localStorage.level = $scope.levelId;
        $log.log("Level: " + $localStorage.level);
        cordova.exec(
            successHdl(),
            errorHdl(),
            "GritLauncher", 
            "startActivity", 
            [ app ]);
    };
}

function successHdl($log) {
    $log.log('open worked');
}
function errorHdl($log) {
    $log.log('open failed');
}

function QuizCtrl($scope, $routeParams, $timeout, Quiz, Result, $http, $log) {

  var http_promise = $http({method: 'GET', url: 'content/locales/kh/quiz.json'});

  // NOTE: not currently using Quiz service

  // .success() gets a desstructured version of the single 'response' object that a .then() callback would get
  http_promise.success(function (data, status, headers, config) {
      // $log.log('success');
      // $log.log(data);
      // $log.log(status);
      // $log.log(headers);
      // $log.log(config);
      $scope.quiz = data;
    });

  http_promise.error(function (data, status, headers, config) {
      $log.log('failed to get quiz data:');
      $log.log(data);
      $log.log(status);
      $log.log(headers);
      $log.log(config);
    });

  // *************

  // $scope.quiz = Quiz.query();
  $scope.orderProp = 'id';
  $scope.display = '1';

  // NOTE: quiz = json quiz data
  $scope.filterByLevel = function(quiz) {
    if(quiz.level == $routeParams.levelId){
        return quiz;
    }
  };
  $scope.$log = $log;

  $scope.levelId = $routeParams.levelId;
  $scope.noDisable = 1;
  $scope.result = Result.getResult();
  var clickTime = 0;
  var questionIndex = 0;

  $scope.resultClick = function (index, length, quiz, answer) {
        $log.log('got result click');
        var result = Result.addResult(quiz, answer);
        var element = document.getElementById(index);

        if (index + 1 >= length && result) {
          window.location = '#/result/' + $routeParams.levelId;
        } else if (index + 1 >= length && clickTime % 2 === 1) {
          window.location = '#/result/' + $routeParams.levelId;
        }

        var nextQuestion = function () {
          angular.element(element).css('display', 'none');
          angular.element(element).next().css('display', 'block');
        };

        var icon = document.getElementById('result_' + clickTime);
        if (result) {
          angular.element(icon).removeClass('current');
          angular.element(icon).addClass('won');
          angular.element(element).find('button').attr('disabled','disabled');

          if ((clickTime % 2) == 0) {
            clickTime ++;
            angular.element(icon).next().removeClass('current');
            angular.element(icon).next().addClass('won');
          }

          $timeout(nextQuestion, 1000);
        } else {
          angular.element(icon).removeClass('current');
          angular.element(icon).addClass('lost');

          if ((clickTime % 2) == 1) {
            angular.element(element).find('button').attr('disabled','disabled');
            $timeout(nextQuestion, 1000);
          }
        }
        clickTime ++;
        return result;
      };
}

function KidsListCtrl($scope, $http, Player, $localStorage, $log) {
    $http.get('content/kids.json').success(function(data) {
        $scope.kids = data;
    });
    $localStorage.level = 1;
    $log.log("Level: " + $localStorage.level);

    $scope.player = Player.getPlayer();
    $scope.setPlayer = function(kid) {
        Player.addPlayer(kid);
    };
    $scope.removePlayer = function() {
        Player.rmPlayer();
    };

    $scope.getLevel = Player.getLevel();


}

function ResultCtrl($scope, $routeParams, Result, $localStorage, $log) {
  $scope.result = Result.getResult();
  $scope.level = $routeParams.levelId;
  $scope.nextLevel = parseInt($routeParams.levelId) + 1;
  $scope.conclusion = Result.getConclusionResult();
  $scope.homeScreen = function(level) {
    Result.removeAll();
    $localStorage.level = level;
    window.location = '#/level/' + level; // FIXME: should this be done through $location service?
  }
  $scope.tryAgain = function(level) {
    Result.removeAll();
    window.location = '#/quiz/' + level; // FIXME: use $location here?
  }
}


