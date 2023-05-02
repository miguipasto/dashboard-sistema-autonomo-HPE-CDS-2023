const mongoose = require('mongoose');

const climatologia = new mongoose.Schema({
  fecha: {
    type: String,
    required: true
  }, 
  centrales: Array
});

const Climatologia = mongoose.model('climatologia', climatologia);

module.exports = Climatologia;
