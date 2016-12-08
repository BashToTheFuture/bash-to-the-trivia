// ADD SERVICES AND FACTORIES HERE

angular.module('app.services', [])
.factory('UserInfo', function($http, $rootScope, $location) {
  var socket = io.connect();
  return {
    user: '',
    rooms: {},
    avatar: 'http://www.how-to-draw-funny-cartoons.com/images/draw-a-goose-001.jpg',
    currentRoom: {},
    activeUsers: [],


    getRoom: function(room) {
      socket.emit('changeRoom', room, this.user);
      if (room === 'Profile') {
        this.activeUsers = [];
      }
      this.currentRoom = this.rooms[room.roomname];
    },

    signUp: function(user) {
      var context = this;
      return $http({
        method: 'POST',
        url: 'api/signup',
        data: user
      }).then(function(resp) {
        if (!resp.data) {
          $location.path('/signin');
        } else {
          console.log("resp Signup", resp.data)
          context.user = resp.data.username;
          context.rooms = resp.data.rooms;
          socket.emit('signUp', {username: resp.data.username});
          $location.path('/home/profile');
        }
      }).catch(function(err) {
        console.log('signup error: ', err);
      });
    },
    signIn: function(user) {
      var context = this;
      return $http({
        method: 'POST',
        url: 'api/signin',
        data: user
      }).then(function(resp) {
        if (!resp.data.username) {
          $location.path('/signup');
        } else {
          console.log("resp Signin", resp.data)
          context.user = resp.data.username;
          context.rooms = resp.data.rooms;
          socket.emit('signIn', {username: resp.data.username});
          $location.path('/home/profile');
        }
      }).catch(function(err) {
        $location.path('/signin');
        console.log('unauthorized', err);
      });
    },
//RE-IMPLEMENTING SOCKETS.IO METHODS TO USE THEM IN THE CONTROLLERS DUE TO SCOPE ISSUES//
    on: function(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
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
    addNewRoom: function (newRoomName) {
      console.log('newRoomName', newRoomName)
      var context = this;
      socket.emit('addNewRoom', newRoomName);
      return $http({
        method: 'POST',
        url: 'api/users/addRoom',
        data: {roomname: newRoomName, currentUser: this.user}
      }).then(function(resp) {
        context.rooms[newRoomName] = {
          roomname: newRoomName,
          admin: context.user
        };
        context.currentRoom = context.rooms[newRoomName];
        $location.path('/home/room/' + newRoomName); 
      });
    },
    addNewPlayer: function(roomname, newPlayerUsername) {
      socket.emit('addNewPlayer', roomname, newPlayerUsername);
    },
    addedToNewRoom: function(room) {
      this.rooms[room.roomname] = room;
      //TODO: update rooms object to add the new roomname, admin and users
      console.log('You have been added to', room.roomname);
    },

    removeActiveUser: function(username) {
      var index = this.activeUsers.indexOf(username);
      this.activeUsers.splice(index, 1);
    },
    addActiveUser: function(username) {
      if (username !== this.user) {
        this.activeUsers.push(username);
      } else {
        //TODO: Emit server request to REDIS DB to get the database of all the active users in the currentroom
      }
    },
    invitedToNewRoom: function(roomInfo) {
      this.rooms[roomInfo.roomname] = roomInfo;
    }
  };
});








