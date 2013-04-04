'use strict';

/* Controllers */


function ContentListCtrl($scope, $http) {
    $http.get('content/apps.json').success(function(data) {
        $scope.content = data;
    });

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

