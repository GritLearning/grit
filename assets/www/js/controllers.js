'use strict';

/* Controllers */


function ContentListCtrl($scope, $http) {
    $http.get('content/apps.json').success(function(data) {
        $scope.content = data;
    });

    $scope.open = function(app, name) {
        console.log("open: " + name);
        cordova.exec(
            successHdl(),
            errorHdl(),
            "Launcher", 
            "open", 
            [app, name]);
    };
}

function successHdl() {
    console.log('open worked');
}
function errorHdl() {
    console.log('open failed');
}

function QuizCtrl($scope, $routeParams, Quiz) {
	/*$scope.quiz = Quiz.get({id: $routeParams.quizId}, function(quiz) {
	    
	});*/
	$scope.quiz = Quiz.query();
	$scope.orderProp = 'id';
	$scope.quizId = $routeParams.quizId;
	$scope.nextQuestion = $routeParams.quizId + 1;
	$scope.resultClick = function () {
		//$routeParams.quizId = $routeParams.quizId + 1;
		//$scope.quizId = $routeParams.quizId;
		//alert($location.hash());
		$location.path('edit');
    }
}

function QuizDetailCtrl($scope, $routeParams) {
  $scope.quizId = $routeParams.quizId;
}

