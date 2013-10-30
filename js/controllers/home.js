angular.module('grit.controllers').controller('RootCtrl', function ($scope, $timeout, $http, $routeParams, $localStorage, $log, _, $window, $location) {
  'use strict';
  $log.log('In RootCtrl');

  // Helper methods
  // **************

  var initStorage = function () {
    if($localStorage.level){
      $log.log('found level: ' + $localStorage.level + ' in storage');
    } else {
      $log.log('found no level in storage');
      $localStorage.level = 1;
    }
  };

  var loadAppsJSON = function (data) {

    // Helpers
    // *******

    function isLevelLocked(level, currentLevel) {
      return (level <= currentLevel) ? false : true;
    }

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
  };

  // Scope Modals
  // ************
  
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

  // Scope Helper Methods
  // ********************

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
      return (level === '#level-1') ? false : true;
    };

    var windowHasNotScrolled = function () {
      return ($('body').scrollTop() === 0) ? false : true;
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

  var enableBodyScrolling = function () {
    $log.log('In enableBodyScrolling()');
    angular.element('body').removeClass('stop-scrolling');
    angular.element('body').off('touchmove.grit.prevent-scroll');
  };

  var disableBodyScrolling = function () {
    $log.log('In disableBodyScrolling()');
    angular.element('body').addClass('stop-scrolling');
    angular.element('body').on('touchmove.grit.prevent-scroll', defaultPreventer);
  };

  var defaultPreventer = function (e) {
    $log.log('In defaultPreventer()');
    e.preventDefault();
  };

  // Navigation
  // **********

  $scope.goToExitScreen = function () {
    $log.log('In goToExitScreen()');
    enableBodyScrolling();
    $location.path('/exit');
  };


  // App Launching 
  // *************

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

  // App Launching Helpers
  // *********************

  function appLaunchSuccessHandler() {
    $log.log('Successfully opened the app');
  }

  function appLaunchErrorHandler() {
    $log.log('Failed to open the app');
  }

  // Init controller
  initStorage();
  $http.get('content/apps/apps.json').success(loadAppsJSON);
});
