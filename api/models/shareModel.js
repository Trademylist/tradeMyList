var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ShareSchema = new Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'product' 
    },
    type: {
        type: String,
        enum: ['product', 'freebies'],
        required: true
    },
    user_id: { type: String, default: null }

}, {
    timestamps: true,
    typecast: true
});


module.exports = mongoose.model('Share', ShareSchema);
