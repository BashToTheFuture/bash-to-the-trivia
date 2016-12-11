angular.module('app', ['app.auth', 'app.user', 'ui.router'])


.config(function($stateProvider, $httpProvider, $qProvider) {

  $stateProvider
  .state('signinState', {
    url: '/signin',
    templateUrl: 'app/auth/signin.html',
    controller: 'AuthController'
  })
  .state('signupState', {
    url: '/signup',
    templateUrl: 'app/auth/signup.html',
    controller: 'AuthController'
  })
  .state('homeState', {
    url: '/home',
    abstract: true,
    templateUrl: 'app/user/home.html',
    controller: 'HomeController'
  })
  .state('homeState.profile', {
    url: '/profile',
    templateUrl: 'app/user/home.profile.html', //#1 view
    controller: 'HomeController'
  })
  .state('homeState.room', {
    url: '/room/:roomname',
    templateUrl: 'app/user/home.room.html',
    controller: 'HomeController'
  })
  .state('homeState.game', {
    url: '/game',
    templateUrl: 'app/user/home.game.html',
    controller: 'HomeController'
  })
  .state('otherwise', {
    url: '*path',
    templateUrl: 'app/user/landing-page.html',
  });

  // $qProvider.errorOnUnhandledRejections(false);

})
// .factory('AttachTokens', function($rootScope, $window, $location, $q) {
//   console.log('here???')
//   return {
//     request: function(object) {
//       console.log('object: ', object);
//       object.headers = object.headers || {};
//       if ($window.localStorage['com.trivia']) {
//         config.headers.Authorization = 'Bearer ' + $window.localStorage['com.trivia'];
//         console.log('config.headers.Authorization: ', config.headers.Authorization);
//       }
//       return object;
//     },
//     response: function(response) {
//       console.log('response',response);
//       if(response.status === 401) {
//         $location.path('/signin');
//         return;
//       }
//       return response || $q.when(response);
//     }
//   };

// })

// .config(function ($httpProvider) {
//   $httpProvider.interceptors.push('AttachTokens');
// });
// .run(function($rootScope, $location, UserInfo) {

//   $rootScope.$on('$stateChangeStart', function(event, next, current) {
//     if (next.$$state && next.$$state.authenticate &&)
//   })

// });




























