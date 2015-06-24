var mongoose = require('mongoose');

var BeerSchema = new mongoose.Schema({
  name: String,
  brewery: String,
  type: String,
  description: String,
  date: { type: Date, default: Date.now },
  ratings: {},
  active: {type: Boolean, default: true}
});

mongoose.model('Beer', BeerSchema);
