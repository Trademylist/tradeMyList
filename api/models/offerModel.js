var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const GeoSchema = new Schema({
  type: {
    type: String,
    default: "Point"
  },
  coordinates: {
    type: [Number],
    index: "2dsphere"
  }
});

var OfferSchema = new Schema({
  offer_image: [{ type: String, default: null }],
  offer_name: { type: String, default: null },
  offer_category: { type: String, default: null },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
    required: true,
    ref: 'Users'
  },
  seller_phone: {
    type: String,
    required: true
  },
  owner_type: {
    type: String,
    enum: ['super_admin', 'admin', 'user'],
    required: true
  },
  offer_description: { type: String, default: null },
  geometry: GeoSchema,
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



module.exports = mongoose.model('Offer', OfferSchema);