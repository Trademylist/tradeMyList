var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ReviewSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'Users'
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'product'
    },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'Users'
    },
    rating: { type: Number, default: 0 },
    tags: [{ type: String, default: null }],
    user_type: {
        type: String,
        enum: ['Buyer', 'Seller'],
        required: true,
    },
    description: { type: String, default: null }

}, {
    timestamps: true,
    typecast: true
});;

module.exports = mongoose.model('Review', ReviewSchema);