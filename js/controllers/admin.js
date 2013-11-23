'use strict';

angular.module('admin-ctrl', [])
  .controller('AdminCtrl', function ($scope, _, $log, $window, $location) {
    $scope.returnToHomeScreen = function () {
      $location.path('/');
    };

    $scope.closeGrit = function () {
      $log.log('Exiting grit - goodbye.');

      if (_.isObject(navigator.app) && _.isFunction(navigator.app.exitApp)) {
        navigator.app.exitApp();
      }
      else {
        $window.alert('If cordova existed I would exit grit - instead I am sending you back to the home screen');
        $location.path('/');
      }
    };
  });
