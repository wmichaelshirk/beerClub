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
/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.13.0 - 2015-05-02
 * License: MIT
 */
angular.module("ui.bootstrap",["ui.bootstrap.rating"]),angular.module("ui.bootstrap.rating",[]).constant("ratingConfig",{max:5,stateOn:null,stateOff:null}).controller("RatingController",["$scope","$attrs","ratingConfig",function(t,e,n){var a={$setViewValue:angular.noop};this.init=function(r){a=r,a.$render=this.render,a.$formatters.push(function(t){return angular.isNumber(t)&&t<<0!==t&&(t=Math.round(t)),t}),this.stateOn=angular.isDefined(e.stateOn)?t.$parent.$eval(e.stateOn):n.stateOn,this.stateOff=angular.isDefined(e.stateOff)?t.$parent.$eval(e.stateOff):n.stateOff;var i=angular.isDefined(e.ratingStates)?t.$parent.$eval(e.ratingStates):new Array(angular.isDefined(e.max)?t.$parent.$eval(e.max):n.max);t.range=this.buildTemplateObjects(i)},this.buildTemplateObjects=function(t){for(var e=0,n=t.length;n>e;e++)t[e]=angular.extend({index:e},{stateOn:this.stateOn,stateOff:this.stateOff},t[e]);return t},t.rate=function(e){!t.readonly&&e>=0&&e<=t.range.length&&(a.$setViewValue(e),a.$render())},t.enter=function(e){t.readonly||(t.value=e),t.onHover({value:e})},t.reset=function(){t.value=a.$viewValue,t.onLeave()},t.onKeydown=function(e){/(37|38|39|40)/.test(e.which)&&(e.preventDefault(),e.stopPropagation(),t.rate(t.value+(38===e.which||39===e.which?1:-1)))},this.render=function(){t.value=a.$viewValue}}]).directive("rating",function(){return{restrict:"EA",require:["rating","ngModel"],scope:{readonly:"=?",onHover:"&",onLeave:"&"},controller:"RatingController",templateUrl:"template/rating/rating.html",replace:!0,link:function(t,e,n,a){var r=a[0],i=a[1];r.init(i)}}});/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.13.0 - 2015-05-02
 * License: MIT
 */
angular.module("ui.bootstrap",["ui.bootstrap.tpls","ui.bootstrap.rating"]),angular.module("ui.bootstrap.tpls",["template/rating/rating.html"]),angular.module("ui.bootstrap.rating",[]).constant("ratingConfig",{max:5,stateOn:null,stateOff:null}).controller("RatingController",["$scope","$attrs","ratingConfig",function(e,t,n){var a={$setViewValue:angular.noop};this.init=function(r){a=r,a.$render=this.render,a.$formatters.push(function(e){return angular.isNumber(e)&&e<<0!==e&&(e=Math.round(e)),e}),this.stateOn=angular.isDefined(t.stateOn)?e.$parent.$eval(t.stateOn):n.stateOn,this.stateOff=angular.isDefined(t.stateOff)?e.$parent.$eval(t.stateOff):n.stateOff;var i=angular.isDefined(t.ratingStates)?e.$parent.$eval(t.ratingStates):new Array(angular.isDefined(t.max)?e.$parent.$eval(t.max):n.max);e.range=this.buildTemplateObjects(i)},this.buildTemplateObjects=function(e){for(var t=0,n=e.length;n>t;t++)e[t]=angular.extend({index:t},{stateOn:this.stateOn,stateOff:this.stateOff},e[t]);return e},e.rate=function(t){!e.readonly&&t>=0&&t<=e.range.length&&(a.$setViewValue(t),a.$render())},e.enter=function(t){e.readonly||(e.value=t),e.onHover({value:t})},e.reset=function(){e.value=a.$viewValue,e.onLeave()},e.onKeydown=function(t){/(37|38|39|40)/.test(t.which)&&(t.preventDefault(),t.stopPropagation(),e.rate(e.value+(38===t.which||39===t.which?1:-1)))},this.render=function(){e.value=a.$viewValue}}]).directive("rating",function(){return{restrict:"EA",require:["rating","ngModel"],scope:{readonly:"=?",onHover:"&",onLeave:"&"},controller:"RatingController",templateUrl:"template/rating/rating.html",replace:!0,link:function(e,t,n,a){var r=a[0],i=a[1];r.init(i)}}}),angular.module("template/rating/rating.html",[]).run(["$templateCache",function(e){e.put("template/rating/rating.html",'<span ng-mouseleave="reset()" ng-keydown="onKeydown($event)" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="{{range.length}}" aria-valuenow="{{value}}">\n    <i ng-repeat="r in range track by $index" ng-mouseenter="enter($index + 1)" ng-click="rate($index + 1)" class="glyphicon" ng-class="$index < value && (r.stateOn || \'glyphicon-star\') || (r.stateOff || \'glyphicon-star-empty\')">\n        <span class="sr-only">({{ $index < value ? \'*\' : \' \' }})</span>\n    </i>\n</span>')}]);var app = angular.module('beerClub', ['ngRoute', 'ngSocket',
'ui.bootstrap.rating', "template/rating/rating.html"]);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl : 'modules/main-menu/main-menu.html'
  })
  .when('/myvotes', {
    templateUrl : 'modules/my-votes/my-votes.html',
    controller  : 'myVotesCtrl as mv'
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

  this.beerTypes = [
    'Wheat Beer',
    'Lambic/Sour',
    'Belgian Ale',
    'Pale Ale',
    'Bitter',
    'Scottish Ale',
    'Brown Ale',
    'Porter',
    'Stout',
    'Pilsner',
    'American Lager',
    'European Lager',
    'Bock',
    'Alt',
    'French Ale',
    'German Amber',
    'American Special',
    'Smoked Beer',
    'Barley Wine',
    'Strong Ale'
  ]
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
  $socket.on('add', function(data) {
    var key = _.keys(data)[0];
    self[key] = self[key] || {};
    _.extend(self[key], data[key]);
  });

  this.addBeer = function(newBeer) {
    $socket.emit('create', {'Beer' : newBeer});
  }
  this.submitVote = function(beer) {
    var newBeer = {'beer': beer._id, 'rating': beer.myVote}
    console.log(newBeer);
    $socket.emit('Vote', newBeer);
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
angular.module('beerClub')
.controller('myVotesCtrl', ['$scope', 'DB',
function($scope, DB) {

  var self=this;

}]);
