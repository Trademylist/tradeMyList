var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SecondOpinionSchema = new Schema({
            category: {type: String, require:true},
            sender_id: {type: String, require:true},
            message:{type: String, require:true},
            privacy: {
                type: String,
                enum: ['public', 'private'],
                default: 'public'
            },
            reciever_id: [{type: String, default:null}], //user id whom you share private message
            
},{
    timestamps: true,
    typecast: true
});


module.exports = mongoose.model('SecondOpinion', SecondOpinionSchema);