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

function ContentListCtrl($scope, $http, $routeParams, Player, $localStorage, $log, _, $window) {
  $http.get('content/apps/apps.json').success(function (data) {
    $scope.apps = data;
    $scope.currentLevel = Number($routeParams.levelId);
    $scope.levels = [];


    var highestLevel = _.max($scope.apps, function (app) { return app.level; }).level;

    // build an array of level objects for the template to use:
    // aLevelObject = { id: <integer>, isLocked: <true|false>, isNext: <true|false> }
   
    for (var i = 1; i <= highestLevel; i += 1) {
      $scope.levels.push({ 
        id: i, 
        isLocked: isLevelLocked(i, $scope.currentLevel),
        isNext: isNextLevel(i, $scope.currentLevel)
      });
    }

    // $log.log($scope.levels);

    function isLevelLocked(level, currentLevel) {
      return (level <= currentLevel) ? false : true;
    }

    function isNextLevel(level, currentLevel) {
      return (currentLevel + 1 == level) ? true : false;
    }
  });

  $scope.player = Player.getPlayer();

  $scope.open = function(app, name) {
    $log.log('Opening app: ' + name);
    $localStorage.level = $scope.currentLevel;
    $log.log('Stored level in localStorage: ' + $localStorage.level);

    if (_.isObject(cordova) && _.isFunction(cordova.exec)) {
      cordova.exec(
        appLaunchSuccessHandler,
        appLaunchErrorHandler,
        'GritLauncher',
        'startActivity',
        [ app ]);
    }
    else {
      $window.alert('If cordova existed I would open: ' + app);
    }
  };
}

function appLaunchSuccessHandler() {
  // TODO: is there a way to inject $log into a stand-alone function (that isn't a controller) like this?
  console.log('Successfully opened the app');
}

function appLaunchErrorHandler() {
  // TODO: is there a way to inject $log into a stand-alone function (that isn't a controller) like this?
  console.log('Failed to open the app');
}

function QuizCtrl($scope, $routeParams, $timeout, Result, $http, $log) {
  $http.get('content/locales/kh/quiz.json').success(function (data) {
    $scope.quiz = data;
  });

  $scope.orderProp = 'id';
  $scope.display = '1';

  $scope.filterByLevel = function(quiz) {
    if(quiz.level == $routeParams.levelId){
        return quiz;
    }
  };

  // TODO: this is just for debugging. Remove before we go into production.
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

// function KidsListCtrl($scope, $http, Player, $localStorage, $log) {
//     $http.get('content/kids.json').success(function(data) {
//         $scope.kids = data;
//     });
//     $localStorage.level = 1;
//     $log.log("Level: " + $localStorage.level);
// 
//     $scope.player = Player.getPlayer();
//     $scope.setPlayer = function(kid) {
//         Player.addPlayer(kid);
//     };
//     $scope.removePlayer = function() {
//         Player.rmPlayer();
//     };
// 
//     $scope.getLevel = Player.getLevel();
// 
// 
// }

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


