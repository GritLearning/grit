'use strict';

angular.module('exit-ctrl', [])
  .controller('ExitCtrl', function ($scope, $location, $localStorage, $log) {
    $log.log('In ExitCtrl()');

    $scope.totalStarsForThisSession = $localStorage.totalStarsForThisSession || 0;
    $log.log('Total stars for this session: ' + $scope.totalStarsForThisSession);

    $scope.resetSession = function () {
      $log.log('Resetting user session data');
      $localStorage.$reset();

      $log.log('Sending user back to the home screen');
      $location.path('/');
    };
  });
