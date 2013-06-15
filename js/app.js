'use strict';


// Declare app level module which depends on filters, and services
//angular.module('App', ['grit.filters', 'grit.services', 'grit.directives'])
angular.module('App', ['grit.filters','grit.services'])
  .config(function ($compileProvider){
          $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
  })
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/level.html', controller: RootCtrl});
    $routeProvider.when('/admin', {templateUrl: 'partials/admin.html', controller: AdminCtrl});
    $routeProvider.when('/exit', {templateUrl: 'partials/exit.html', controller: ExitCtrl});
    $routeProvider.when('/result/:levelId', {templateUrl: 'partials/result.html', controller: ResultCtrl});
    $routeProvider.when('/level/:levelId', {templateUrl: 'partials/level.html', controller: ContentListCtrl});
    $routeProvider.when('/quiz/:levelId', {templateUrl: 'partials/quiz.html', controller: QuizCtrl});
    $routeProvider.otherwise({redirectTo: '/'});
  }])
  .directive('scoreIconDirective', function($compile) {
     return {
    	scope: {
            levelId: "=levelId",
            result: "=result"
         },
         link: function($scope, $element, $attrs) {
        	 $element.append("<div class='span1'>Level" + $scope.levelId + "</div>");
        	 for(var i=0; i<10; i++) {
        		 if (i == 0 || i == 1) {
        			 $element.append("<div class='span1 current' id='result_" + i + "'><span></span></div>");
        		 } else {
        			 $element.append("<div class='span1 next' id='result_" + i + "'><span></span></div>");
        		 }
        		 
        	 }
        	 $compile($element.contents())($scope);
         }
     };
  })
  .directive('myRepeatDirective', function() {
     return function(scope, element, attrs) {
       if (! scope.$first) {
    	   angular.element(element).css('display','none');
       }
     };
  });

