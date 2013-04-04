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
    }

//    $scope.player = [
//        { image: "img/child-placeholder.png" }
//    ];
//
//  $scope.setPlayer = function(kid) {
//    var k2 = $scope.player.pop();
//    if(k2 && k2.name){
//        $scope.player.push(k2);
//        $scope.player.push(kid);
//    } else {
//        $scope.player.push(kid);
//    }
//    console.log( kid );
//  };
//
//  $scope.removePlayer = function(kid) {
//      var k2 = $scope.player.pop();
//      if(k2){
//          console.log( kid );
//      } else {
//        $scope.player.push({image: "img/child-placeholder.png"});
//      }
//  };
//
//  $scope.getFirstLevel = function() {
//      var level = 0;
//      for(p in $scope.player){
//        if(p.level > level){
//            level = p.level;
//        }
//      }
//      console.log("Level: " + level);
//      return level;
//  };

}


