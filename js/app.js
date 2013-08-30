'use strict';

angular.module('App', ['grit.filters', 'grit.services', 'ngStorage', 'ngRoute'])
  .config(function ($compileProvider){
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
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
  .directive('validPwd', function() {
      return {
          // restrict to an attribute type.
          //restrict: 'A',

          // element must have ng-model attribute.
          require: 'ngModel',

          // scope = the parent scope
          // elem = the element the directive is on
          // attr = a dictionary of attributes on the element
          // ctrl = the controller for ngModel.
          link: function(scope, elem, attr, ctrl) {

              //get the regex flags from the regex-validate-flags="" attribute (optional)
              //var flags = attr.regexValidateFlags || '';

              // create the regex obj.
              var regex = new RegExp(attr.validPwd);            

              // add a parser that will process each time the value is 
              // parsed into the model when the user updates it.
              ctrl.$parsers.unshift(function(value) {
                  // test and set the validity after update.
                  var valid = regex.test(value);
                  ctrl.$setValidity('validPwd', valid);

                  // if it's valid, return the value to the model, 
                  // otherwise return undefined.
                  return valid ? value : undefined;
              });

              // add a formatter that will process each time the value 
              // is updated on the DOM element.
              ctrl.$formatters.unshift(function(value) {
                  // validate.
                  ctrl.$setValidity('validPwd', regex.test(value));

                  // return the value or nothing will be written to the DOM.
                  return value;
              });
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
