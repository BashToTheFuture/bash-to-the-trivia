angular.module('app.user', ['app.services'])

.controller('HomeController', function($scope, UserInfo) {
  //Passing data from the UserInfo factory
  $scope.user = UserInfo.user;
  $scope.rooms = UserInfo.rooms;
  $scope.avatar = UserInfo.avatar;
  $scope.users = {};


  $scope.goToRoom = function(roomName) {
    UserInfo.getRoom(roomName);
    $scope.room = UserInfo.currentRoom;
    $scope.users.usernames = UserInfo.currentRoom.usernames;

  };

  $scope.addRoom = function(newRoomName) {
    // $scope.rooms[newRoomName] = {roomname: newRoomName, admin: $scope.user};

    UserInfo.addNewRoom(newRoomName);/*.then(function() {
      return $scope.newRoom.setPristine();
    });*/
  };

  $scope.startGame = function() {
    UserInfo.getQuestions().then(function() {

    });
  };


})


.controller('GameController', function($scope, UserInfo) {

  //Local scope variable
  $scope.activeUsers = [];
  $scope.questions = [];
  $scope.answers = [];




})

.controller('RoomController', function($scope, UserInfo) {

})

;