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

// may need body-parser?
// may need serve-favicon?


// Mongoose models.
mongoose.connect('mongodb://localhost/beerClub');
var User          = mongoose.model('User');
var ConnectedUser = mongoose.model('ConnectedUser');
var Beer          = mongoose.model('Beer');




app.use(express.static('public'));
server.listen(process.env.PORT || 8080);

io.on('connection', function(socket) {
  var id;
  // When logging in.
  socket.on('login', function(data) {
    checkToken(data, function(success) {
      var userData = success;
      userData.socketId = socket.id;
      logUser(userData);
      pushUpdates('Beer');
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


var pushUpdates = function(model) {

  Beer.find({}).sort('-date').exec(function(err, results) {
    if (err) { console.error(err); }
    else {
      io.emit('update', {'beers': results });
    }
  });
};
