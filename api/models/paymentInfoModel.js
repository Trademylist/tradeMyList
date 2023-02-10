var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PaymentInfoSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'Users'
    },
    product_id: {type:String,required:true},
    info: { } 

}, {
    timestamps: true,
    typecast: true
});


module.exports = mongoose.model('PaymentInfo', PaymentInfoSchema);
