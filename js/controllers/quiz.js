'use strict';
/* global QUIZ_JSON_URL */

angular.module('quiz-ctrl', ['config'])
  .controller('QuizCtrl', function ($scope, $routeParams, $timeout, $http, $log, $location, $document, $q, $localStorage, _) {
    $log.log('QuizCtrl()');

    // Helper methods
    // **************

    var loadQuizJSON = function (questions) {
      $log.log('Loading quiz JSON');
      $scope.quiz = filterQuestions(questions);
    };

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

      var processPotentialStar = function (element) {
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

        angular.element(element).on('webkitTransitionEnd', function () {
          angular.element(starSlot).find('.js-empty-slot-img').hide();
          angular.element(starSlot).find('.js-full-slot-img').show();
          angular.element(element).hide(); // hide the element we just moved so that it doesn't look odd when we slide-out this question
          deferred.resolve();
          $scope.$apply();
        });

        markStarSlotAsFull(starSlot);
      };

      _.each(allVisiblePotentialStars(questionIndex), processPotentialStar);

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

    // Decorate the $scope for use by the HTML
    // ***************************************

    $scope.numberOfQuestionPartsIn = function (question) {
      /* jshint camelcase: false */
      if (_.isObject(question.question_2) && question.question_2.url.length > 0) {
        return 2;
      } else {
        return 1;
      }
    };

    $http.get(QUIZ_JSON_URL).success(loadQuizJSON);

    $scope._ = _;
    $scope.questionIndexToShow = 0;
    $scope.levelId = $routeParams.levelId;
    $scope.showQuiz= true;
    $scope.showResults = false;

    $scope.processAnswer = function (question, answer, questionIndex, isFinalQuestion) {
      /* jshint camelcase: false */

      $log.log('processAnswer()');

      if (question.correct_answer.text === answer.text) { // answer is correct
        saveResultToStorage(numVisiblePotentialStars(questionIndex));

        moveAvailableStarsToStarSlots(questionIndex).then(function () {
          if (isFinalQuestion) {
            showResults();
          } else {
            displayNextQuestion();
          }
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

            if (isFinalQuestion) {
              showResults();
            } else {
              displayNextQuestion();
            }
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
  });
