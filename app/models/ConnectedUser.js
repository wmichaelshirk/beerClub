var mongoose = require('mongoose');

var ConnectedUserSchema = new mongoose.Schema({
  _id: String,
  userId: Number
});

mongoose.model('ConnectedUser', ConnectedUserSchema);
