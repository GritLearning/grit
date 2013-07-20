'use strict';

/* Controllers */

function RootCtrl($location) {
    console.log("in root controller");
    if(window.localStorage.getItem("level")){
        var level = window.localStorage.getItem("level");
        console.log("found level: " + level);
        $location.path('/level/' + level);
    } else {
        $location.path('/level/1');
        console.log("found no level");
    }
}

function ExitCtrl($scope) {
    console.log("exiting");
    $scope.levelId = window.localStorage.getItem("level");

    if($scope.levelId){
        console.log("exit: found level: " + $scope.levelId);
    } else {
        $scope.levelId = 0;
        console.log("exit: found no level");
    }
    // TODO: we need to remove the level storage to reset the app for next round of playing
}

function AdminCtrl($scope, Player) {
    $scope.closeGrit = function(){
        navigator.app.exitApp();
    };

    $scope.player = Player.getPlayer();
    $scope.settings = function() {
        cordova.exec(
            successHdl(),
            errorHdl(),
            "GritLauncher", 
            "startActivity", 
            [ 'com.android.settings' ]);
    };
}

function ContentListCtrl($scope, $http, $routeParams, Player) {
    $http.get('content/apps.json').success(function(data) {
        $scope.content = data;
    });

    $scope.filterByLevel = function(content) {
        if(content.level == $scope.levelId){
            return content;
        }
    };

    $scope.filterByLevelFromHere = function(content) {
        if(content.level > $scope.levelId){
            return content;
        }
    };

    $scope.levelId = Number($routeParams.levelId);
    $scope.player = Player.getPlayer();

    $scope.open = function(app, name) {
        console.log("open: " + name);
        window.localStorage.setItem("level", $scope.levelId);
        console.log("Level: " + window.localStorage.getItem("level"));
        cordova.exec(
            successHdl(),
            errorHdl(),
            "GritLauncher", 
            "startActivity", 
            [ app ]);
    };
}

function successHdl() {
    console.log('open worked');
}
function errorHdl() {
    console.log('open failed');
}

function QuizCtrl($scope, $routeParams, $timeout, Quiz, Result) {
	$scope.quiz = Quiz.query();
	$scope.orderProp = 'id';
	$scope.display = '1';
	$scope.filterByLevel = function(quiz) {
        if(quiz.level == $routeParams.levelId){
            return quiz;
        }
    };
    $scope.levelId = $routeParams.levelId;
    $scope.noDisable = 1;
    $scope.result = Result.getResult();
    var clickTime = 0;
    var questionIndex = 0;
	$scope.resultClick = function (index, length, quiz, answer) {
		var result = Result.addResult(quiz, answer);
		var element = document.getElementById(index);
		if (index + 1 >= length && result) {
			window.location = '#/result/' + $routeParams.levelId;
		} else if (index + 1 >= length && clickTime % 2 == 1) {
			window.location = '#/result/' + $routeParams.levelId;
		}
		var nextQuestion = function () {
			angular.element(element).css('display', 'none');
			angular.element(element).next().css('display', 'block');
		}
		var icon = document.getElementById('result_' + clickTime);
		if (result) {
			angular.element(icon).removeClass('current');
			angular.element(icon).addClass('won');
			angular.element(element).find('button').attr('disabled','disabled');
			if ((clickTime % 2) == 0) {
				clickTime ++;
				angular.element(icon).next().removeClass('current');
				angular.element(icon).next().addClass('won');
			}
			$timeout(nextQuestion, 1000);
		} else {
			angular.element(icon).removeClass('current');
			angular.element(icon).addClass('lost');
			if ((clickTime % 2) == 1) {
				angular.element(element).find('button').attr('disabled','disabled');
				$timeout(nextQuestion, 1000);
			}
		}
		clickTime ++;
		return result;
    };
}

function KidsListCtrl($scope, $http, Player) {
    $http.get('content/kids.json').success(function(data) {
        $scope.kids = data;
    });
    window.localStorage.setItem("level", 1);
    console.log("Level: " + window.localStorage.getItem("level"));

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
        window.localStorage.setItem("level", level);
		window.location = '#/level/' + level;
	}
	$scope.tryAgain = function(level) {
		Result.removeAll();
		window.location = '#/quiz/' + level;
	}
}


