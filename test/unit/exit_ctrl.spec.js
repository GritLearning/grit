'use strict';

describe('ExitCtrl', function () {
  /* globals module, inject, spyOn */

  var $scope, $location, $localStorage;

  // * create $injector for the named module and all it's dependencies
  // * does the same thing that ng-app directive does in HTML
  // * services from this module should be prepared for this test
  // * you can call module() many times during a test - all the modules it prepares are available via $injector
  beforeEach(module('exit-ctrl'));

  // inject()
  // * injects the services into our tests
  // $injector will strip leading & trailing underscores from a parameter to work out the name of the dependency (MAGIC!!!)
  // * It is the mocked versions of these objects that is injected!
  beforeEach(inject(function ($rootScope, _$location_, $controller, _$log_) {

    // Setup variables for each test run
    $scope = $rootScope.$new();
    $location = _$location_;

    // This is my own mock of $localStorage since one is not provided
    $localStorage = {
      $reset: function () {},
      totalStarsForThisSession: 2
    };

    // $controller creates an instance of a controller given the name and a
    // object of local variables (which includes scope) 
    // * it wires the ExitCtrl and $scope together - then we can use $scope
    //   just like a view would
    // * this is what the ng-controller directive does
    // * in angular the controller only runs once - it mutates the scope and
    //   then exits
    $controller('ExitCtrl', {
      $scope: $scope,
      $location: _$location_,
      $log: _$log_,
      $localStorage: $localStorage
    });
  }));

  it('reads stars from local storage', function () {
    expect($scope.totalStarsForThisSession).toEqual(2);
  });

  describe('resetSession()', function () {

    it('resets local storage', function () {
      spyOn($localStorage, '$reset');
      $scope.resetSession();
      expect($localStorage.$reset).toHaveBeenCalled();
    });

    it('redirects the browser back to site root', function () {
      $scope.resetSession();
      expect($location.path()).toBe('/');
    });
  });
});
