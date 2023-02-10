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

var ProductSchema = new Schema({
  image: [{ type: String, default: null }],
  cover_thumb: { type: String, default: null },
  product_name: { type: String, default: null },
  category: { type: String, default: null },
  sub_category:[{
    key: {type: String},
    value:{type: String}
 }],
 sub_category_number:[{
  key: {type: String},
  value:{type: Number}
}],
  product_price: { type: Number, default: null },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
    required: true,
    ref: 'Users'
  },
  seller_phone: {
    type: String,
    default:null
  },
  product_description: { type: String, default: null },
  address: { type: String, default: null },
  geometry: GeoSchema,
  country: {
    type: String,
    trim: true,
    default: null
  },
  boost: { type: Number, default: 0 },
  boosted_upto: { type: Number, default: 0 },
  soldOut : { type: Boolean, default: false },
  isBlock: { type: Boolean, default: false },
  likelist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      default: null,
      ref: 'Users'
    }
  ],
  currencyCode: { type: String },
  product_type:{type:String,default:"Product"}
}, {
  timestamps: true,
  typecast: true
});

ProductSchema.index({geometry: '2dsphere'})

module.exports = mongoose.model('Product', ProductSchema);