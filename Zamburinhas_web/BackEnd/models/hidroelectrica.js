const mongoose = require('mongoose');

const hidroelectrica = new mongoose.Schema({
  fecha: {
    type: String,
    required: true
  },
  centrales: Array
  }
  );

const Hidroelectrica = mongoose.model('hidroelectrica', hidroelectrica);

module.exports = Hidroelectrica;
