var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AdSchema = new Schema({
    ad_title: { type: String, default: null },
    ad_image: [{
        type: String, default: null
    }],
    ad_link: { type: String, default: null },
    AdMob: { type: String, default: null },
    ad_category: {
        type: String,
        require: true
    },
    ad_type: {
        type: String,
        enum: ['AdMob', 'Image'],
        require: true
    },
    country: [{
        type: String,
        trim: true,
        default: null
    }],
    isBlock: { type: Boolean, default: false }
}, {
    timestamps: true,
    typecast: true
});



module.exports = mongoose.model('Ad', AdSchema);
