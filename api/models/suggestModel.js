var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SuggestSchema = new Schema({
            message: {type: String,default:null},
            type:{type: String,default:null}

},{
    timestamps: true,
    typecast: true
});


module.exports = mongoose.model('Suggest', SuggestSchema);
