'use strict';

/* Controllers */

function ExitCtrl($scope, $location, $localStorage, $log) {
  $log.log("In ExitCtrl()");

  $scope.totalStarsForThisSession = $localStorage.totalStarsForThisSession || 0;
  $log.log('Total stars for this session: ' + $scope.totalStarsForThisSession);

  $scope.resetSession = function () {
    $log.log('Resetting user session data');
    $localStorage.$reset();

    $log.log('Sending user back to the home screen');
    $location.path('/');
  };
}

function AdminCtrl($scope, _, $log, $window, $location) {
  $scope.returnToHomeScreen = function () {
    $location.path('/');
  };

  $scope.closeGrit = function (){
    $log.log('Exiting grit - goodbye.');

    if (_.isObject(navigator.app) && _.isFunction(navigator.app.exitApp)) {
      navigator.app.exitApp();
    }
    else {
      $window.alert('If cordova existed I would exit grit - instead I am sending you back to the home screen');
      $location.path('/');
    }
  };
}

function RootCtrl($scope, $timeout, $http, $routeParams, Player, $localStorage, $log, _, $window, $location, $anchorScroll) {
  $log.log('In RootCtrl');

  if($localStorage.level){
    $log.log('found level: ' + $localStorage.level + ' in storage');
  } else {
    $log.log('found no level in storage');
    $localStorage.level = 1;
  }

  $http.get('content/apps/apps.json').success(function (data) {
    $scope.apps = data;
    $scope.currentLevel = Number($localStorage.level);
    $scope.nextLevel = $scope.currentLevel + 1;
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
        isLocked: isLevelLocked(i, $scope.currentLevel)
      });
    }

    // helper functions
    // ****************

    function isLevelLocked(level, currentLevel) {
      return (level <= currentLevel) ? false : true;
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

  $scope.scrollToHighestOpenLevel = function () {
    // We want to scroll to the highest open level when we load the page.
    // Unfortunately because the levels are loaded by Angular ngRepeat
    // directive , they don't reliably exist during execution of the
    // controller.  The other problem is changing $location.hash triggers
    // routing which causes this controller to get run again. This is why I
    // have chosen to manually scroll the correct element into view using
    // element.scrollIntoView()

    $log.log('Scrolling to highest open level: ' + $localStorage.level);

    var id = '#level-' + $localStorage.level,
        attempts = 0,
        maxAttempts = 10,
        delayBetweenAttempts = 100; // mS;

    var scrollTo = function (id) {
      $(id)[0].scrollIntoView(true);
    };

    var targetElementHasBeenRendered = function (id) {
      if ($(id).height() > 0) {
        $log.log('target element has been rendered');
        return true;
      } else {
        $log.log('target element has NOT been rendered');
        return false;
      }
    };

    var levelIsNotFirstLevel = function (level) {
      (level === '#level-1') ? false : true; 
    };

    var windowHasNotScrolled = function () {
      ($('body').scrollTop() === 0) ? false : true; 
    };

    var rescheduleScrollAttempt = function () {
      if (attempts < maxAttempts) {
        $log.log('rescheduling a scroll attempt');
        $timeout(tryToScroll, delayBetweenAttempts);
      }
    };

    var tryToScroll = function () {
      attempts += 1;
      if (targetElementHasBeenRendered(id)) {
        scrollTo(id);
        if (levelIsNotFirstLevel() && windowHasNotScrolled()) {
          rescheduleScrollAttempt();
        }
      } else {
        rescheduleScrollAttempt();
      }
    };

    tryToScroll();
  };

  $scope.goToExitScreen = function () {
    $log.log('In goToExitScreen()');
    enableBodyScrolling();
    $location.path('/exit');
  };

  var enableBodyScrolling = function () {
    $log.log('In enableBodyScrolling()');
    angular.element('body').removeClass('stop-scrolling');
    angular.element('body').off('touchmove.grit.prevent-scroll');
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
  $log.log('QuizCtrl()');

  $http.get('content/locales/kh/quiz.json').success(function (questions) {
  // $http.get('content/locales/en/quiz.json').success(function (questions) {
    $log.log('Loading quiz JSON');
    $scope.quiz = filterQuestions(questions);
  });

  $scope._ = _;
  $scope.questionIndexToShow = 0;
  $scope.levelId = $routeParams.levelId;
  $scope.showQuiz= true;
  $scope.showResults = false;

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
        var delay = 2000; // mS
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
  };

  // Helper methods
  // **************

  var filterQuestions = function (questions) {
    return _.chain(questions)
            .where({ level: Number($routeParams.levelId) })
            .shuffle()
            .first(5)
            .value();
  };


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
      $location.path('/');
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

    // mark the potential-star wrapper as no longer winnable 
    $firstVisiblePotentialStar.removeClass('js-is-winnable');
  };

  var areAllPotentialStarsLost = function (questionIndex) {
    var numWinnableStars = $document.find('.question-' + questionIndex + ' .potential-stars .potential-star.js-is-winnable').length;
    return (numWinnableStars === 0) ? true : false;
  };
}
