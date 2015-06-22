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
