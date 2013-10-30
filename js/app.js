'use strict';

// create modules
angular.module('grit.controllers', []);

angular.module('App', ['grit.filters', 'ngAnimate', 'grit.controllers', 'grit.directives', 'ngStorage', 'ngRoute', 'ngTouch'])

  .config(function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
  })

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'views/home.html', controller: 'RootCtrl'});
    $routeProvider.when('/admin', {templateUrl: 'views/admin.html', controller: 'AdminCtrl'});
    $routeProvider.when('/exit', {templateUrl: 'views/exit.html', controller: 'ExitCtrl'});
    $routeProvider.when('/quiz/:levelId', {templateUrl: 'views/quiz.html', controller: 'QuizCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
