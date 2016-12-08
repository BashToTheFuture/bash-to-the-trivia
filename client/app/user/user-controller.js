angular.module('app.user', ['app.services'])

.controller('HomeController', function($scope, UserInfo, $interval) {
  //Passing data from the UserInfo factory
  $scope.user = UserInfo.user;
  $scope.rooms = UserInfo.rooms;
  $scope.avatar = UserInfo.avatar;
  $scope.users = {};


  $scope.goToRoom = function(roomName) {
    $scope.room = UserInfo.getRoom(roomName);
    $scope.users.usernames = UserInfo.currentRoom.usernames;
  };

  $scope.addRoom = function(newRoomName) {
    // $scope.rooms[newRoomName] = {roomname: newRoomName, admin: $scope.user};
    UserInfo.addNewRoom(newRoomName);
  };

  // $scope.startGame = function() {
  //   UserInfo.getQuestions().then(function() {

  //   });
  // };



//SOCKET.IO EVENT LISTENNERS//
  UserInfo.on('newUserSignedUp', function(data) {
    console.log(data.username, ' got connected');
  });

  UserInfo.on('UserLeft', function(username) {
    console.log(username, ' has left the room');
    UserInfo.removeActiveUser(username);
  });

  UserInfo.on('UserJoined', function(username) {
    console.log(username, ' has joined the room');
    UserInfo.addActiveUser(username);
  });

  UserInfo.on('InvitetoNewRoom', function(roomInfo) {
    UserInfo.invitedToNewRoom(roomname);
  });



///ALISSA Starting Game:
  // UserInfo.on('startGame', function(){
  //   UserInfo.startGame();

  // });

  // UserInfo.on('submitAnswer', function() {
  //   console.log('socket fired on ctrl side')
  //   UserInfo.submitAnswer();
  // })

  $scope.startGame = function() {
    UserInfo.startGame();
  };

  $scope.sendQuestion = function() {
    UserInfo.sendQuestion();
  };

  // var len = $scope.questionSet.length;
  //   if (len === 0 ) {
  //     console.log(len,'length checki')
  //     return;

  //     // $interval.cancel();
  //   }

  $interval(function() {
    $scope.sendQuestion();
  }, 5000);




  $scope.submitAnswer=function() {
    UserInfo.submitAnswer();
  }

//after an answer has been submited, check if it is right or wrong
  // $scope.submitAnswer=function() {
  //   UserInfo.submitAnswer();
  // };


//////////////////////////////

})


.controller('ProfileController', function($scope, UserInfo, $rootScope) {

  $scope.activeUsers = [];
  $scope.questions = [];
  $scope.answers = [];

})


.controller('GameController', function($scope, UserInfo) {

  //Local scope variable
  $scope.activeUsers = ['dummy1', 'dummy2'];
  $scope.questions = ['what\'s your name?'];
  $scope.answers = [];
  $scope.choices=['A','B','C','D']




})

.controller('RoomController', function($scope, UserInfo) {

})

;