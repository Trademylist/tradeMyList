var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
    receiver_id: { type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'Users' },
    seller_id: {type: String, default: null},
    sender_id: {type: String, default: null},
    product_id:{type: String, default: null},
    click_action:{type: String,default: null},
    title:{type: String,default: null},
    message:{type: String,default: null},
    image:{type: String,default: null},
    product_type:{type: String,default: null},
    seen:{ type: Boolean, default: false }  
}, {
        timestamps: true,
        typecast: true
      });;

module.exports = mongoose.model('Notification',NotificationSchema);