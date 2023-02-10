var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ChatBlockSchema = new Schema({
            user_id: {type: String, default: null},
            product_id: {type: String,default:null},
            blocked_id:{type:Boolean, default:false}

},{
    timestamps: true,
    typecast: true
});


module.exports = mongoose.model('ChatBlock', ChatBlockSchema);
