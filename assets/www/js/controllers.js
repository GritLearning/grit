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

    $scope.levelId = Number($routeParams.levelId);

    $scope.open = function(app, name) {
        console.log("open: " + name);
        /* thi makes the app crash, fix later! */
        cordova.exec(
            successHdl(),
            errorHdl(),
            "GritLauncher", 
            "startActivity", 
            [ app ]);
        /**/
    };
}

function successHdl() {
    console.log('open worked');
}
function errorHdl() {
    console.log('open failed');
}

function QuizCtrl($scope, $routeParams, Quiz, Result) {
	$scope.quiz = Quiz.query();
	$scope.orderProp = 'id';
	$scope.display = '1';
	$scope.filterByLevel = function(quiz) {
        if(quiz.level == $routeParams.levelId){
            return quiz;
        }
    };
    $scope.result = Result.getResult();
	$scope.resultClick = function (index, length, quiz, answer) {
		Result.addResult(quiz, answer);
		if (index + 1 >= length) {
			window.location = '#/result/' + $routeParams.levelId;
		}
		var element = document.getElementById(index);
		angular.element(element).css('display', 'none');
		angular.element(element).next().css('display', 'block');
    };
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

    $scope.getLevel = Player.getLevel();


}

function ResultCtrl($scope, $routeParams, Result) {
	$scope.result = Result.getResult();
	$scope.level = $routeParams.levelId;
	$scope.nextLevel = parseInt($routeParams.levelId) + 1;
	$scope.conclusion = Result.getConclusionResult();
	$scope.homeScreen = function(level) {
		Result.removeAll();
		window.location = '#/level/' + level;
	}
	$scope.tryAgain = function(level) {
		Result.removeAll();
		window.location = '#/quiz/' + level;
	}
}


