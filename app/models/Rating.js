var mongoose = require('mongoose');

var RatingSchema = new mongoose.Schema({
  user: String,
  beer: String,
  rating: Number
});

mongoose.model('Rating', RatingSchema);
