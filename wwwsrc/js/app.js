'use strict';

angular.module('controllers', ['root-ctrl', 'exit-ctrl', 'admin-ctrl', 'quiz-ctrl']);

// create the main application module
// TODO: ngStorage is a dependency of multiple controllers. should it be marked
//       as a dependency here or individually in the controllers that need it?
angular.module('App', ['filters', 'controllers', 'directives', 'ngAnimate', 'ngStorage', 'ngRoute'])
  .config(function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
  })
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'views/home.tpl.html', controller: 'RootCtrl'});
    $routeProvider.when('/admin', {templateUrl: 'views/admin.tpl.html', controller: 'AdminCtrl'});
    $routeProvider.when('/exit', {templateUrl: 'views/exit.tpl.html', controller: 'ExitCtrl'});
    $routeProvider.when('/quiz/:levelId', {templateUrl: 'views/quiz.tpl.html', controller: 'QuizCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
