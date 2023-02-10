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

var VacanciesSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    trim: true,
    required: true,
    ref: 'Users'
  },
  job_title: { type: String, default: null },
  job_description: { type: String, default: null },
  key_skill: [{ type: String, default: null }],
  job_location: { type: String, default: null },
  contactperson_phone: { type: String, default: null },
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


module.exports = mongoose.model('Vacancies', VacanciesSchema);
