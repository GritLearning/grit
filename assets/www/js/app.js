'use strict';


// Declare app level module which depends on filters, and services
//angular.module('App', ['grit.filters', 'grit.services', 'grit.directives'])
angular.module('App', ['grit.services'])
  .config(function ($compileProvider){
          $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
  })
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/kids', {templateUrl: 'partials/kids.html', controller: KidsListCtrl});
    $routeProvider.when('/level', {templateUrl: 'partials/level.html', controller: ContentListCtrl});
    $routeProvider.when('/quiz/:quizId', {templateUrl: 'partials/quiz.html', controller: QuizCtrl});
    $routeProvider.otherwise({redirectTo: '/level'});
  }]);

