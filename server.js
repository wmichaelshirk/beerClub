var https    = require('https');
var express  = require('express');
var app      = express();
var server   = require('http').Server(app);
var io       = require('socket.io')(server);
var _        = require('underscore');
var mongoose = require('mongoose');
               require('./app/models/User');
               require('./app/models/ConnectedUser');
               require('./app/models/Beer');
               require('./app/models/Rating');

// may need body-parser?
// may need serve-favicon?


// Mongoose models.
mongoose.connect('mongodb://localhost/beerClub');
var User          = mongoose.model('User');
var ConnectedUser = mongoose.model('ConnectedUser');
var Beer          = mongoose.model('Beer');
var Rating        = mongoose.model('Rating');
var ObjectId      = mongoose.Types.ObjectId;




app.use(express.static('public'));
server.listen(process.env.PORT || 3000);

io.on('connection', function(socket) {
  var id;
  // When logging in.
  socket.on('login', function(data) {
    checkToken(data, function(success) {
      var userData = success;
      id = userData.sub;
      userData.socketId = socket.id;
      logUser(userData);
      pushUpdates('Beer', socket);
      pushVotes(socket);
      pushUsers();
    });
  });
  socket.on('logout', function(data) {
    disconnect(socket.id);
  })
  socket.on('disconnect', function(data) {
    disconnect(socket.id);
  });
  socket.on('create', function(data) {
    _.each(_.keys(data), function(obj) {
      var thisObj = new (mongoose.model(obj))(data[obj]);
      thisObj.save(function (err) {
        if (err) { console.error(err); }
        console.log('New ' + obj + ' added.');
        pushUpdates('Beer');
      });
    });
  });
  socket.on('Vote', function(data) {
    if (id) {
      var obj = {};
      obj['ratings.'+id] = data.rating;
      Beer.update({_id: new ObjectId(data.beer)},
                  {$set: obj},
                  function (err, found) {
        if (err) { console.error(err); }
        pushUpdates('Beer');
      });
    }
  });
  socket.on('Delete', function(data) {
      Beer.find({_id: new ObjectId(data.beer)})
          .remove(function() {
            pushUpdates('Beer');
          });
  });
  socket.on('Close', function(data) {
    Beer.update({_id: new ObjectId(data.beer)},
                {$set: {'active':false}},
                function (err, found) {
                  if (err) { console.error(err); }
                  pushUpdates('Beer');
                });
  });
});



// Helper functions

/*
 * Check a token for validity with google.
 */
var checkToken = function(token, callback, error) {
  var error = error || function(e) { console.error(e);};
  var user = {};
  https.get({
    host: 'www.googleapis.com',
    path: '/oauth2/v3/tokeninfo?id_token='+token
  },
  function (response) {
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
    });
    response.on('end', function() {
      var resp = JSON.parse(str);
      if (resp.aud == '604204486967-jiqfjjk5ar31ae1mehjq9eaa1nptlllk.apps.googleusercontent.com') {
        callback(resp);
      } else {
        error('Invalid token');
      }
    });
  });
};

/* Add user to DB (if not already there);
 * store in list of currently-logged-in users.
*/
var logUser = function(userData) {
  var thisUser = new User({
    _id: userData.sub,
    firstName: userData.given_name,
    lastName : userData.family_name,
    photoUrl: userData.picture,
    connected: true,
    socket: userData.socketId
  });
  User.findOneAndUpdate(
    { '_id' : thisUser._id }, // Query
    thisUser,                 // Model
    { upsert: true },         // Update or Insert, either one
    function (err) {
      if (err) { console.error(err); }
      console.log(thisUser.firstName + " logged in.");
    }
  );
  //io.emit('users', User.find({connected: true}));
};

var disconnect = function(socketId) {
  User.findOne(
    {socket: socketId}, function (err, usr) {
      if (err) { console.error(err); }
      if (usr) {
        usr.connected = false;
        usr.socket = '';
        usr.save(function (err) {
          if (err) { console.error(err); }
          console.log(usr.firstName + ' logged out.');
        });
      };
    }
  );
};


var pushUpdates = function(model, target) {
  target = target || io;
  Beer.find({}).sort('-date').lean().exec(function(err, results) {
    if (err) { console.error(err); }
    else {
      /* Start - calculate scores */
      _.map(results, function (beer) {
        var votes = votes = [[],[],[],[],[]];
        _.mapObject(beer.ratings, function(val, key) {
          votes[val-1].push(key);
        });
        beer.votes = votes;
        // find the average to the nearest quarter.
        var sum = votes[0].length +
                  votes[1].length * 2 +
                  votes[2].length * 3 +
                  votes[3].length * 4 +
                  votes[4].length * 5;
        var avg = Math.round((sum / _.flatten(votes).length) * 4) /4;
        beer.avg = avg;
        return beer;
      });
      /* -- end - calculate. */
      target.emit('update', {'beers': results });
    }
  });
};
var pushUsers = function() {
  User.find({}).exec(function(err, results) {
    if (err) { console.error(err); }
    else {
      results =_.indexBy( _.map(results, function (e) {
        return {id: e._id,
          firstName: e.firstName,
          lastName: e.lastName,
          photo: e.photoUrl }
      }), 'id');
      io.emit('update', {'users': results });
    }
  });
};
var pushVotes = function(sock) {
  User.findOne({socket: sock.id}).select('_id').exec(function(err, user) {
    if (err) { console.error(err); }
    var ratingReturn = {};
    if (user) {
      Rating.find({user: user._id}).exec(function(err, ratings) {
        if (err) { console.error(err); }
        ratingReturn = _.map(ratings, function (r) {
          return [r.beer, r.rating];
        });
        sock.emit('add', {'myVotes': _.object(ratingReturn)});
      });
    }

  });
};
//      var returnVote = {};
//      returnVote[thisVote.beer] = thisVote.rating;
//      socket.emit('add', {'myVotes': returnVote});
