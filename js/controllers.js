'use strict';

/* Controllers */

function RootCtrl($scope, $location, $localStorage, $log) {
  $log.log("in RootCtrl");
  var level = $localStorage.level;
  if(level){
    $log.log("found level: " + level + ' in storage');
    $location.path('/level/' + level);
  } else {
    $location.path('/level/1');
    $log.log("found no level in storage - defaulting to level 1");
  }
}

function ExitCtrl($scope, $location, $localStorage, $log) {
  $log.log("In ExitCtrl()");

  $scope.totalStarsForThisSession = $localStorage.totalStarsForThisSession || 0;
  $log.log('Total stars for this session: ' + $scope.totalStarsForThisSession);

  $scope.resetSession = function () {
    $log.log('Resetting user session data');
    $localStorage.$reset();

    $log.log('Sending user back to levels screen');
    $location.path('/level/1');
  };
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

function ContentListCtrl($scope, $http, $routeParams, Player, $localStorage, $log, _, $window, $location) {
  $log.log('In ContentListCtrl');
  $http.get('content/apps/apps.json').success(function (data) {
    $scope.apps = data;
    $scope.currentLevel = Number($routeParams.levelId);
    $scope.levels = [];

    $scope.openQuiz = function (level) {
      $log.log('Opening quiz for level ' + level);
      $location.path('/quiz/' + level);
    };

    $scope.totalStarsForThisSession = $localStorage.totalStarsForThisSession || 0;
    $log.log('Total stars for this session: ' + $scope.totalStarsForThisSession);


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

    // helper functions
    // ****************

    function isLevelLocked(level, currentLevel) {
      return (level <= currentLevel) ? false : true;
    }

    function isNextLevel(level, currentLevel) {
      return (currentLevel + 1 == level) ? true : false;
    }

  });

  // modals
  // ******
  
  $scope.showFinishModal = function () {
    $log.log('In showFinishModal()');
    angular.element('.modal-overlay').removeClass('hidden');
    angular.element('.finish-modal').addClass('visible');
    disableBodyScrolling();
  };

  $scope.hideFinishModal = function () {
    $log.log('In hideFinishModal()');
    angular.element('.modal-overlay').addClass('hidden');
    angular.element('.finish-modal').removeClass('visible');
    enableBodyScrolling();
  };

  $scope.goToExitScreen = function () {
    $log.log('In goToExitScreen()');
    enableBodyScrolling();
    $location.path('/exit');
  };

  var enableBodyScrolling = function () {
    $log.log('In enableBodyScrolling()');
    angular.element('body').removeClass('stop-scrolling');
    angular.element('body').off('touchmove.grit.prevent-scroll')
  };

  var disableBodyScrolling = function () {
    $log.log('In disableBodyScrolling()');
    angular.element('body').addClass('stop-scrolling');
    angular.element('body').on('touchmove.grit.prevent-scroll', defaultPreventer)
  };

  var defaultPreventer = function (e) {
    $log.log('In defaultPreventer()');
    e.preventDefault();
  };

  // app launching 
  // *************
  
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
  $http.get('content/locales/kh/quiz.json').success(function (data) {
  // $http.get('content/locales/en/quiz.json').success(function (data) {
    $scope.quiz = data;
  });

  $scope._ = _;
  $scope.questionIndexToShow = 0;
  $scope.levelId = $routeParams.levelId;

  $scope.showQuiz= true;
  $scope.showResults = false;

  $scope.filterByLevel = function(quiz) {
    if(quiz.level == $routeParams.levelId){
      return quiz;
    }
  };

  $scope.processAnswer = function (question, answer, questionIndex, isFinalQuestion) {

    $log.log('processAnswer()');

    if (question.correct_answer.text === answer.text) { // answer is correct
      saveResultToStorage(numVisiblePotentialStars(questionIndex));

      moveAvailableStarsToStarSlots(questionIndex).then(function () {
        isFinalQuestion ? showResults() : displayNextQuestion();
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
          isFinalQuestion ? showResults() : displayNextQuestion();
        }, delay);
      }
    }
  };

  $scope.layoutDone = function () {
    // schedule a function to run in our next turn in the event loop
    $timeout(function () { 
      $log.log('in the layoutDone() callback');
      $('.question').addClass('slide-in-out'); // add the class that enables questions to slide in & out.
    }, 0); 
  }

  // Helper methods
  // **************

  var disableAllAnswers = function () {
    $document.find('.possible-answers .possible-answer').attr('disabled', true);
    $document.find('.possible-answers .possible-answer .frame').addClass('frame-disabled');
  };
  var enableAllAnswers = function () {
    $document.find('.possible-answers .possible-answer .frame').removeClass('frame-disabled');
    $document.find('.possible-answers .possible-answer').attr('disabled', false);
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
        angular.element(element).hide(); // hide the element we just moved so that it doesn't look odd when we slide-out this question
        deferred.resolve();
        $scope.$apply();
      });

      markStarSlotAsFull(starSlot);
    });

    // return a combined promise that will be fullfilled when *both* animations finish
    return $q.all(promises); 
  };

  var didUserPassQuiz = function (result) {
    var PASS_MARK = 7;
    return (result >= PASS_MARK) ? true : false;
  };
  
  var updateStoredTotalSessionStars = function (stars) {
    var a = parseInt($localStorage.totalStarsForThisSession, 10) || 0;
    var b = parseInt(stars, 10) || 0;
    $localStorage.totalStarsForThisSession = a + b;
  };

  var resetPerQuizStars = function () {
    $localStorage.stars = 0;
  };

  var showResults = function () {
    $log.log('showResults()');
    $scope.showQuiz = false;
    $scope.showResults = true;

    // manage stars 
    // ************
    
    $scope.stars = $localStorage.stars;
    $scope.passed = didUserPassQuiz($scope.stars);

    if ($scope.passed) {
      updateStoredTotalSessionStars($scope.stars);
    }

    // Reset the per-quiz stars counter
    $localStorage.stars = 0;

    // manage levels 
    // ************

    // attempt to load stored level and default to 1 if we cannot
    $scope.level = parseInt($localStorage.level, 10) || 1;
    $log.log('Setting level to ' + $scope.level);

    if ($scope.passed) {
      $scope.level += 1;
    }
    $localStorage.level = $scope.level;


    $log.log('localStorage: stars ' + $localStorage.stars);
    $log.log('localStorage: totalStarsForThisSession' + $localStorage.totalStarsForThisSession);

    $scope.returnToHomeScreen = function () {
      $location.path('/level/' + $scope.level);
    };
  };

  var saveResultToStorage = function (stars) {
    $log.log('Saving ' + stars + ' stars to localStorage');

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
    $log.log('next question index is: ' + $scope.questionIndexToShow);
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
