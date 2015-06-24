angular.module('beerClub').
service('DB', ['$socket', 'googleService', function($socket, googleService) {
  var self = this;

  $socket.on('update', function (data) {
    _.extend(self, data);
    _.each(self.beers, function(beer) {
      beer.myVote = _.findIndex(beer.votes,function(vote) {
        return _.contains(vote, googleService.user.id);
      }) + 1;
    });
  });
  $socket.on('add', function(data) {
    var key = _.keys(data)[0];
    self[key] = self[key] || {};
    _.extend(self[key], data[key]);
  });
  $socket.on('voteForBeer', function(data) {
    console.log(_.filter(this.beers, function(e) { return e._id == data[0]}));
  });

  this.addBeer = function(newBeer) {
    $socket.emit('create', {'Beer' : newBeer});
  }
  this.submitVote = function(beer) {
    var newBeer = {'beer': beer._id, 'rating': beer.myVote}
    console.log(newBeer);
    $socket.emit('Vote', newBeer);
  }
  this.submitVote1 = function(beer) {
    var newBeer = {'beer': beer._id, 'rating': beer.myVote}
    console.log(newBeer);
    $socket.emit('Vote', newBeer);
  }
}]);
