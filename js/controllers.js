'use strict';

/* Controllers */

function RootCtrl($location, $localStorage, $log) {
  $log.log("in root controller");
  var level = $localStorage.level;

  if(level){
    $log.log("found level: " + level + ' in storage');
    $location.path('/level/' + level);
  } else {
    $location.path('/level/1');
    $log.log("found no level in storage - defaulting to level 1");
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

    $scope.openQuiz = function (level) {
      $log.log('Opening quiz for level ' + level);
      // TODO: is this the idiomatic way to navigate in angular?
      $window.location.href = '#/quiz/' + level;
    };

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

function QuizCtrl($scope, $routeParams, $timeout, Result, $http, $log, $location, $document, $q, $localStorage, _) {

  // TODO: re-enable khmer before release. I have disabled it because I can't
  //       answer questions in it :-)
  // $http.get('content/locales/kh/quiz.json').success(function (data) {
  $http.get('content/locales/en/quiz.json').success(function (data) {
    $scope.quiz = data;
  });

  $scope._ = _;
  $scope.questionIndexToShow = 0;

  $scope.filterByLevel = function(quiz) {
    if(quiz.level == $routeParams.levelId){
      return quiz;
    }
  };

  $scope.processAnswer = function (question, answer, questionIndex, isFinalQuestion) {

    if (question.correct_answer.text === answer.text) { // answer is correct
      saveResultToStorage(numVisiblePotentialStars(questionIndex));

      moveAvailableStarsToStarSlots(questionIndex).then(function () {
        isFinalQuestion ? goToResults() : displayNextQuestion();
      });
    }
    else { // answer is wrong 
      hideFirstVisiblePotentialStar(questionIndex);


      if (areAllPotentialStarsLost(questionIndex)) {
        var delay = 2000 // mS
        disableAllAnswers();

        saveResultToStorage(0);

        $timeout(function () {
          enableAllAnswers();
          isFinalQuestion ? goToResults() : displayNextQuestion();
        }, delay);
      }
    }
  };

  // Helper methods
  // **************

  var disableAllAnswers = function () {
    $document.find('.possible-answers .possible-answer .btn').attr('disabled', true);
  };
  var enableAllAnswers = function () {
    $document.find('.possible-answers .possible-answer .btn').attr('disabled', false);
  };

  var markStarSlotAsFull = function (starSlot) {
    angular.element(starSlot).removeClass('js-is-empty');
    angular.element(starSlot).addClass('js-is-full');
  };

  var nextAvailableStarSlot = function () {
    return $document.find('.star-slots .star-slot.js-is-empty')[0];
  };

  var allVisiblePotentialStars = function (questionIndex) {
    return $document.find('.question-' + questionIndex + ' .potential-stars .potential-star.js-is-winnable');
  };

  var numVisiblePotentialStars = function (questionIndex) {
    return allVisiblePotentialStars(questionIndex).length;
  };

  var moveAvailableStarsToStarSlots = function (questionIndex) {

    var promises = [];

    _.each(allVisiblePotentialStars(questionIndex), function (element) {
      var starSlot = nextAvailableStarSlot();
      var currentOffset = angular.element(element).offset();
      var newOffset =  angular.element(starSlot).offset();
      var offsetChange = {};

      // Force the offset change to always be negative
      offsetChange.top  = - Math.abs(currentOffset.top  - newOffset.top);
      offsetChange.left = - Math.abs(currentOffset.left - newOffset.left);

      // We have to dynamically calculate the distances of the transform as
      // there are enough permutations (2 stars x 10 possible slots) to make
      // doing it declaratively painful. However we still declare as much of the
      // animation as possible in the CSS.
      var translation = 'translate3d(' + offsetChange.left + 'px, ' + offsetChange.top + 'px,0px)';
      angular.element(element).css('-webkit-transform', translation);

      var deferred = $q.defer();
      promises.push(deferred.promise);

      angular.element(element).on('webkitTransitionEnd', function (event) {
        angular.element(starSlot).find('.js-empty-slot-img').hide();
        angular.element(starSlot).find('.js-full-slot-img').show();
        deferred.resolve();
        $scope.$apply();
      });

      markStarSlotAsFull(starSlot);
    });

    // return a combined promise that will be fullfilled when *both* animations finish
    return $q.all(promises); 
  };
  
  var goToResults = function () {
    $location.path('/result/' + $routeParams.levelId);
  };

  var saveResultToStorage = function (stars) {
    // If there was not already a value in stars, trying to add 1 to it returns NaN
    if ($localStorage.stars) {
      $localStorage.stars += stars;
    }
    else {
      $localStorage.stars = stars;
    }

    $log.log('User now has ' + $localStorage.stars + ' stars');
  };

  var displayNextQuestion = function () {
    $scope.questionIndexToShow += 1;
  };

  var hideFirstVisiblePotentialStar = function(questionIndex) {
    var $firstVisiblePotentialStar = $document.find('.question-' + questionIndex + ' .potential-stars .potential-star.js-is-winnable').first();

    // change the star img to indicate that it has been lost
    angular.element('.js-won-star-img', $firstVisiblePotentialStar).hide('fast');

    // mark the potential-star wrapper as lost
    $firstVisiblePotentialStar.removeClass('js-is-winnable');
    $firstVisiblePotentialStar.addClass('js-is-lost');
  };

  var areAllPotentialStarsLost = function (questionIndex) {
    var numWinnableStars = $document.find('.question-' + questionIndex + ' .potential-stars .potential-star.js-is-winnable').length;
    return (numWinnableStars === 0) ? true : false;
  };
}

function ResultCtrl($scope, $localStorage, $log, $location) {

  var didUserPassQuiz = function (result) {
    var PASS_MARK = 7;
    return (result >= PASS_MARK) ? true : false;
  };

  $scope.passed = didUserPassQuiz($localStorage.stars);
  $scope.score = $localStorage.stars;

  // remove the user's result from storage
  $localStorage.stars = 0;

  $scope.level = parseInt($localStorage.level, 10);
  if ($scope.passed) {
    $scope.level += 1;
  }
  $localStorage.level = $scope.level;

  $scope.returnToHomeScreen = function () {
    $location.path('/level/' + $scope.level);
  };
} 
