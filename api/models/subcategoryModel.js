var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SubcategorySchema = new Schema({
    name:{type:String},
    type:{type:String},
    division:[{type:String}],
    filter:[{key:{type:String},value:{type:String},image:{type:String}}],
    isBlock: { type: Boolean, default: false }
});



module.exports = mongoose.model('Subcategory', SubcategorySchema);
