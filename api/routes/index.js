const { model } = require("../models/meals.model");

module.exports = {
    meals: require('./meals.routes'),
    orders: require('./orders.routes')
}