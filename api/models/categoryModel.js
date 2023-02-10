var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    category_image: [{ type: String, default: null }],
    category_name: {
        type: String,
        required: true,
        default: null
    },
    sub_category:[{
       key: {type: String},
       value:[{type: String}]
    }],
    category_type: {
        type: String,
        required: true,
        default: null
    },
    country: {
        type: String,
        trim: true,
        default: null
    },
    isBlock: { type: Boolean, default: false }
});

module.exports = mongoose.model('Category',CategorySchema);
