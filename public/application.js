var app = angular.module('beerClub', ['ngRoute', 'ngSocket',
'ui.bootstrap']);

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
  .when('/admin', {
    templateUrl : 'modules/admin/admin.html'
  })
  .otherwise({
    redirectTo: '/'
  });
}]);

app.controller('mainController', ['googleService', '$scope', 'DB',
function(googleService, $scope, DB) {
  this.googleService = googleService;
  this.DB = DB;

  var self=this;

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
      name: self.newBeerName,
      brewery: self.newBeerBrewery,
      type: self.newBeerType,
      description: self.newBeerDescription
    });
    self.alert={
      type: 'success', msg: this.newBeerName+" successfully added!"
    };
    self.newBeerName="";
    self.newBeerBrewery = "";
    self.newBeerType = "";
    self.newBeerDescription="";
  };

  this.closeAlert = function() {
    self.alert=null;
  }

  this.activeLength = function() {
    return (_.filter(DB.beers, function (e) {
      return e.active == true;
    })).length
  }



}]);
