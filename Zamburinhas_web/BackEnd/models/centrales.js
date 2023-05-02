const mongoose = require('mongoose');

const centrales = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  areas: [{
    Area:{
      type : String,
      required : true
    },
    Distancia:{
      type : Number,
      required : true
    }

  }]

});

const Centrales = mongoose.model('centrales', centrales);

module.exports = Centrales;
