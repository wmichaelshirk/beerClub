/*
 * ngSocket.js
 * https://github.com/chrisenytc/ng-socket
 *
 * Copyright (c) 2013 Christopher EnyTC, David Prothero
 * Licensed under the MIT license.
 */

// Module Copyright (c) 2013 Michael Benford

// Module for provide Socket.io support

(function () {
  'use strict';

  angular.module('ngSocket', [])
    .provider('$socket', socketProvider);

  function socketProvider() {
    var url;

    this.setUrl = setUrl;
    this.getUrl = getUrl;
    this.$get = ['$rootScope', socketFactory];

    function setUrl(value) {
      url = value;
    }

    function getUrl() {
      return url;
    }

    function socketFactory($rootScope) {
      var socket;

      var service = {
        addListener: addListener,
        on: addListener,
        once: addListenerOnce,
        removeListener: removeListener,
        removeAllListeners: removeAllListeners,
        emit: emit,
        getSocket: getSocket
      };

      return service;
      ////////////////////////////////

      function initializeSocket() {
        //Check if socket is undefined
        if (typeof socket === 'undefined') {
          if (url !== 'undefined') {
            socket = io.connect(url);
          } else {
            socket = io.connect();
          }
        }
      }

      function angularCallback(callback) {
        return function () {
          if (callback) {
            var args = arguments;
            $rootScope.$apply(function () {
              callback.apply(socket, args);
            });
          }
        };
      }

      function addListener(name, scope, callback) {
        initializeSocket();

        if (arguments.length === 2) {
          scope = null;
          callback = arguments[1];
        }

        socket.on(name, angularCallback(callback));

        if (scope !== null) {
          scope.$on('$destroy', function () {
            removeListener(name, callback);
          });
        }
      }

      function addListenerOnce(name, callback) {
        initializeSocket();
        socket.once(name, angularCallback(callback));
      }

      function removeListener(name, callback) {
        initializeSocket();
        socket.removeListener(name, angularCallback(callback));
      }

      function removeAllListeners(name) {
        initializeSocket();
        socket.removeAllListeners(name);
      }

      function emit(name, data, callback) {
        initializeSocket();
        socket.emit(name, data, angularCallback(callback));
      }
      
      function getSocket() {
        return socket;
      }
    }
  }

})();
var app = angular.module('beerClub', ['ngRoute', 'ngSocket']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl : 'modules/main-menu/main-menu.html'
  })
  .when('/myvotes', {
    templateUrl : 'modules/my-votes/my-votes.html'
  })
  .when('/submit', {
    templateUrl : 'modules/submit-beer/submit-beer.html'
  })
  .when('/beers', {
    templateUrl : 'modules/beer-ratings/beer-ratings.html'
  })
  .when('/login', {
    templateUrl : 'modules/login-screen/login-screen.html'
  })
  .otherwise({
    redirectTo: '/'
  });
}]);

app.controller('mainController', ['googleService', '$scope', 'DB',
function(googleService, $scope, DB) {
  this.googleService = googleService;
  this.DB = DB;

  console.log(this);
  window.signIn = function(x) {
    googleService.signIn(x);
    $scope.$apply();
  }

  this.users = [];

  this.submitBeer = function() {
    console.log('submit');
    DB.addBeer({
      name: this.newBeerName,
      brewery: this.newBeerBrewery,
      type: this.newBeerType,
      description: this.newBeerDescription
    });
  };



}]);
angular.module('beerClub').
service('DB', ['$socket', function($socket) {
  var self = this;

  $socket.on('update', function (data) {
    console.log(data);
    _.extend(self, data);
  });

  this.addBeer = function(newBeer) {
    $socket.emit('create', {'Beer' : newBeer});
  }
}]);
angular.module('beerClub').
service('googleService', ['$socket', function($socket) {
  var self = this;
  self.isLoggedIn = false;
  self.isAuthorized = false;
  self.user = {};

  this.signIn = function(googleUser) {
    var profile  = googleUser.getBasicProfile();
    self.user.name    = profile.getName();
    self.user.image   = profile.getImageUrl();
    self.user.token   = googleUser.getAuthResponse().id_token;
    self.isAuthorized = true;
    $socket.emit('login', self.user.token );
  };

  this.signOut = function() {
    gapi.auth2.getAuthInstance().signOut();
    $socket.emit('logout');
    //self.isLoggedIn = false;
    // TODO disconnect Socket.
    self.isAuthorized = false;
    self.user = {};
  };

}]);
