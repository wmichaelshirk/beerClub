var app = angular.module('beerClub', ['ngRoute', 'ngSocket',
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
