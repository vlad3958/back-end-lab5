const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    brand: String,
    model: String,
    year: Number,
    owner: {
        name: String,
        age: Number,
    },
});

module.exports = mongoose.model('Car', carSchema);