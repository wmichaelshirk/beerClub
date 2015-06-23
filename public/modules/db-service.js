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
