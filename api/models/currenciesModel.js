var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var CurrenciesSchema = new Schema({
    countryCode: {type: String, default: null},
    countryName: {type: String, default: null},
    currencyCode: {type: String, default: null},
    population: {type: Number, default: null},
    capital: {type: String, default: null},
    continentName: {type: String, default: null}
    
});


module.exports = mongoose.model('Currencies', CurrenciesSchema);