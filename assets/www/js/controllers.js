'use strict';

/* Controllers */


function ContentListCtrl($scope, $http, $routeParams) {
    $http.get('content/apps.json').success(function(data) {
        $scope.content = data;
    });

    $scope.filterByLevel = function(item) {
        return item.value < $scope.inputNumber;
    };

    $scope.open = function(app, name) {
        console.log("open: " + name);
        /* thi makes the app crash, fix later!
        cordova.exec(
            successHdl(),
            errorHdl(),
            "GritLauncher", 
            "startActivity", 
            [ app ]);
        */
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
    };
}

function QuizDetailCtrl($scope, $routeParams) {
  $scope.quizId = $routeParams.quizId;
}

function KidsListCtrl($scope, $http, Player) {
    $http.get('content/kids.json').success(function(data) {
        $scope.kids = data;
    });

    $scope.player = Player.getPlayer();
    $scope.setPlayer = function(kid) {
        Player.addPlayer(kid);
    };
    $scope.removePlayer = function() {
        Player.rmPlayer();
    };


}


