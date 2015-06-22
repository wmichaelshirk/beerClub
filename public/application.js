var app = angular.module('beerClub', ['ngRoute', 'ngSocket',
'ui.bootstrap.rating', "template/rating/rating.html"]);

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
