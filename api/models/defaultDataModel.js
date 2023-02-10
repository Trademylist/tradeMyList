var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var defaultDataSchema = new Schema({
    type:{
        type:String,
        required:true,
        unique:true
    },
    value:{ 
        type:Number,
    },
    image:{
        type:String
    },
    title:{
        type:String
    },
    text:{
        type:String
    }
}, {
    timestamps: true,
    typecastS: true
});



module.exports = mongoose.model('defaultData', defaultDataSchema);