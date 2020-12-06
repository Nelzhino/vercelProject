const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Meals = mongoose.model('Meal', new Schema({
    name: String,
    description: String
}));

module.exports = Meals;