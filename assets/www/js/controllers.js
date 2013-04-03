'use strict';

/* Controllers */


function ContentListCtrl($scope) {
$scope.content = [
    {
        id: 1,
        name: 'Monkey Game',
        launchCommand: 'com.monkey.game',
        icon: 'img/monkey.png',
        type: 'app',
        level: 1
    },
    {
        id: 2,
        name: 'Count 20',
        launchCommand: 'com.monkey.game',
        icon: 'img/monkey.png',
        type: 'app',
        level: 1
    },
    {
        id: 3,
        name: 'Boring Count 10',
        launchCommand: 'com.monkey.game',
        icon: 'img/monkey.png',
        type: 'app',
        level: 2
    },
    {
        id: 4,
        name: 'Exciting count 50',
        launchCommand: 'com.monkey.game',
        icon: 'img/monkey.png',
        type: 'app',
        level: 2
    },
    {
        id: 5,
        name: 'How to count',
        launchCommand: 'com.monkey.game',
        icon: 'img/monkey.png',
        type: 'video',
        level: 1
    }
];
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

