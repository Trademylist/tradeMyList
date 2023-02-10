const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ReportSchema = new Schema({
    reported_to: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'Users'
      },
    reported_by:{
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'Users'
      },
      
    comment :{type:String, default:null},
    sub_comment :{type:String, default:null},
    manual_comment:{type:String},
    status: {
        type: String,
        enum: ['Pending','Processing', 'Completed'],
        default: 'Pending'
    }

}, {
  timestamps: true,
  typecast: true
});

module.exports = mongoose.model('Report', ReportSchema);