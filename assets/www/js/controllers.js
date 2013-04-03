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

function QuizCtrl($scope) {
    $scope.quiz = [
        {
            id: 1,
            question: 'Which is the biggest number',
            answer: [1,2,3,4]
        }
    ];
}

function QuizDetailCtrl($scope, $routeParams) {
  $scope.quizId = $routeParams.quizId;
}

