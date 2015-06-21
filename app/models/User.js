var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  _id: String,
  firstName: String,
  lastName: String,
  photoUrl: String,
  connected: Boolean,
  socket: String
});

mongoose.model('User', UserSchema);
