'use strict';


// Declare app level module which depends on filters, and services
//angular.module('App', ['grit.filters', 'grit.services', 'grit.directives'])
angular.module('App', ['grit.services'])
  .config(function ($compileProvider){
          $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
  })
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/kids.html', controller: RootCtrl});
    $routeProvider.when('/admin', {templateUrl: 'partials/admin.html', controller: AdminCtrl});
    $routeProvider.when('/kids', {templateUrl: 'partials/kids.html', controller: KidsListCtrl});
    $routeProvider.when('/result/:levelId', {templateUrl: 'partials/result.html', controller: ResultCtrl});
    $routeProvider.when('/level/:levelId', {templateUrl: 'partials/level.html', controller: ContentListCtrl});
    $routeProvider.when('/quiz/:levelId', {templateUrl: 'partials/quiz.html', controller: QuizCtrl});
    $routeProvider.otherwise({redirectTo: '/'});
  }])
  .directive('myRepeatDirective', function() {
     return function(scope, element, attrs) {
       if (! scope.$first) {
    	   angular.element(element).css('display','none');
       }
     };
  });

