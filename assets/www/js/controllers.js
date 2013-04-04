'use strict';

/* Controllers */


function ContentListCtrl($scope, $http, $routeParams, Player) {
    $http.get('content/apps.json').success(function(data) {
        $scope.content = data;
    });

    $scope.filterByLevel = function(content) {
        if(content.level == $scope.levelId){
            return content;
        }
    };

    $scope.levelId = $routeParams.levelId;

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
	$scope.filterByLevel = function(quiz) {
        if(quiz.level == $routeParams.quizId){
            return quiz;
        }
    };
	$scope.resultClick = function () {
		//alert('button click');
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


