var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CmsSchema = new Schema({
            page_name: {type: String, default: null},
            page_desc: {type: String,default:null},
            isBlock:{type:Boolean, default:false}

},{
    timestamps: true,
    typecast: true
});


module.exports = mongoose.model('Cms', CmsSchema);
