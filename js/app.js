'use strict';


// create modules
angular.module('grit.controllers', []);

angular.module('App', ['grit.filters', 'ngAnimate', 'grit.controllers', 'grit.services', 'grit.directives', 'ngStorage', 'ngRoute', 'ngTouch'])
  .config(function ($compileProvider){
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
  })
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/home.html', controller: 'RootCtrl'});
    $routeProvider.when('/admin', {templateUrl: 'partials/admin.html', controller: 'AdminCtrl'});
    $routeProvider.when('/exit', {templateUrl: 'partials/exit.html', controller: 'ExitCtrl'});
    $routeProvider.when('/quiz/:levelId', {templateUrl: 'partials/quiz.html', controller: 'QuizCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
