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

app.controller('mainController', ['googleService', '$scope', '$socket', function(googleService, $scope, $socket) {
  this.googleService = googleService;
  window.signIn = function(x) {
    googleService.signIn(x);
    $scope.$apply();
  }

  this.users = [];

  $socket.on('users', function(data) {
    this.users = data;
  });



}]);
