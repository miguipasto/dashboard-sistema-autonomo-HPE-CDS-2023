const mongoose = require('mongoose');

const demanda = new mongoose.Schema({
  fecha: {
    type: String,
    required: true
  }, 
  centrales: Array
  }
);

const Demanda = mongoose.model('demanda', demanda);

module.exports = Demanda;
