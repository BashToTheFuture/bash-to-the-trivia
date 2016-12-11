// ADD SERVICES AND FACTORIES HERE

angular.module('app.services', [])
.factory('UserInfo', function($http, $rootScope, $location, $window) {
  var socket = io.connect();

  return {
    user: {},
    rooms: {},
    avatar: 'http://www.how-to-draw-funny-cartoons.com/images/draw-a-goose-001.jpg',
    currentRoom: {},
    activeUsers: [],

    addNewRoom: function (newRoomName) {
      var context = this;
      return $http({
        method: 'POST',
        url: 'api/users/addRoom',
        data: {roomname: newRoomName, currentUser: context.user.username}
      }).then(function successCallback(resp) {
        var user = {
          username: context.user.username,
          score: 0
        };
        context.rooms[newRoomName] = {
          roomname: newRoomName,
          users: [user],
          admin: context.user.username
        };
        context.currentRoom = context.rooms[newRoomName];
        console.log('AddNewRoom: ', context.currentRoom);
        $location.path('/home/room/' + newRoomName);
        socket.emit('addNewRoom', newRoomName);
      }, function errorCallback(err) {
          throw err;
      });
    },

    addNewPlayer: function(roomname, newPlayerUsername) {
      var context = this;
      return $http({
        method: 'POST',
        url: 'api/users/addNewPlayer',
        data: {roomname: roomname, newPlayerUsername: newPlayerUsername}
      }).then(function successCallback(resp) {
        var newPlayer = {
          username: newPlayerUsername,
          score: 0,
        };
        context.rooms[roomname].users.push(newPlayer);
        context.currentRoom = context.rooms[roomname];
        console.log('addNewPlayer SUCCESS', context.currentRoom);
        socket.emit('addNewPlayer', context.currentRoom, newPlayerUsername);
      }, function errorCallback(err) {
          throw err;
      });
    },

    startNewGame: function() {
      return $http({
        method: 'GET',
        url: 'api/questions'
      }).then(function successCallback(resp) {

        for (var i = 0; i < resp.data.length; i++) {
          resp.data[i].incorrect_answers.splice(Math.floor(Math.random() * 4), 0, resp.data[i].correct_answer);
          resp.data[i].answerChoices = resp.data[i].incorrect_answers;
        }
        $rootScope.questionSet = resp.data;
        socket.emit('startNewGame', resp.data);
      }, function errorCallback(err) {
        throw err;
      });
    },

    addedToNewRoom: function(room) {
      alert('You have been added to' + room.roomname);
      return this.rooms[room.roomname] = room;
      //TODO: update rooms object to add the new roomname, admin and users
    },
    invitedToNewRoom: function(roomInfo) {
      this.rooms[roomInfo.roomname] = roomInfo;
    },

    getRoom: function(room) {
      socket.emit('changeRoom', room);
      this.currentRoom = this.rooms[room.roomname];
      return this.currentRoom;
    },

    sendScore: function(score) {
      var context = this;
      return $http({
        method: 'POST',
        url: 'api/updateScores',
        data: {username: context.user.username,
          score: score,
          roomname: context.currentRoom.roomname
        }
      }).then(function successCallback(resp) {
        socket.emit('updateScores', context.currentRoom.roomname);
      }, function errorCallback(err) {
        throw err;
      });
    },

    updateAllScores: function() {
      var context = this;
      return $http({
        method: 'GET',
        url: 'api/getScores/' + context.currentRoom.roomname
      }).then(function successCallback(resp) {
        context.rooms[resp.data.roomname] = resp.data;
        context.currentRoom = context.rooms[resp.data.roomname];
        console.log('1: ', context.currentRoom);
      }, function errorCallback(err) {
        throw err;
      });
    },

//RE-IMPLEMENTING SOCKETS.IO METHODS TO USE THEM IN THE CONTROLLERS DUE TO SCOPE ISSUES//
    on: function(eventName, callback) {
      if (!socket.hasListeners(eventName)) {
        socket.on(eventName, function() {
          var args = arguments;
          $rootScope.$apply(function() {
            callback.apply(socket, args);
          });
        });
      }
    },
    emit: function(eventName, callback) {
      socket.emit(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    },
/////////////////////////////////////////////////////////////////////


    signUp: function(user) {
      var context = this;
      return $http({
        method: 'POST',
        url: 'signup/',
        data: user
      }).then(function(resp) {
        console.log("RESP",resp)
        console.log("signUp response", resp.data);
        if (!resp.data) {
          $location.path('/signin');
        } else {
          context.user.username = resp.data.user.username;
          context.rooms = resp.data.rooms;
          socket.emit('signUp', {username: resp.data.user.username});
          // $window.localStorage.setItem('com.trivia', resp.data.token);
          $location.path('/home/profile');
        }
      }).catch(function(err) {
        delete $window.localStorage;
        console.log('signup error: ', err);
      });
    },

    signIn: function(user) {
      var context = this;
      return $http({
        method: 'POST',
        url: 'signin/',
        data: user
      }).then(function(resp) {
        console.log("signIn response", resp.data);
        if (!resp.data) {
          $location.path('/signup');
        } else {
          context.user.username = resp.data.user.username;
          context.rooms = resp.data.rooms;
          socket.emit('signIn', {username: resp.data.user.username});
          $location.path('/home/profile');
        }
      }).catch(function(err) {
        $location.path('/signin');
        console.log('unauthorized', err);
      });
    },

  };
});








