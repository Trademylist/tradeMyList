var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AmountInfoSchema = new Schema({
    currency_code: {type:String,required:true},
    amount: { type:  Number  },
    paymentType:{type:String}
});


module.exports = mongoose.model('AmountInfo', AmountInfoSchema);
