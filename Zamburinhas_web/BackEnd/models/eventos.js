const mongoose = require('mongoose');

const coal = new mongoose.Schema({
    fecha: {
        type: String,
        required: true
    },
    central: Array
});

const Coal = mongoose.model('eventos', coal);

module.exports = Coal;
