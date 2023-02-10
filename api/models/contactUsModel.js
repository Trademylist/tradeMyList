var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ContantUsSchema = new Schema({
            email: {type: String, default: null},
            name: {type: String,default:null},
            description:{type: String,default:null},
            option:{type: String,default:null},
            phone_no:{type: String,default:null},
            file:{type: String,default:null}

},{
    timestamps: true,
    typecast: true
});


module.exports = mongoose.model('ContactUs', ContantUsSchema);
