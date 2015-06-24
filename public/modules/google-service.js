angular.module('beerClub').
service('googleService', ['$socket', function($socket) {
  var self = this;
  self.isLoggedIn = false;
  self.isAuthorized = false;
  self.user = {};

  this.signIn = function(googleUser) {
    var profile  = googleUser.getBasicProfile();
    self.user.id      = profile.getId();
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
