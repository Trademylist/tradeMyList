const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
   comment:{type: String, required:true},
   sub_comment:[{type:String ,default:null}] ,
   type:{type:String ,default:"report"}

}, {
  timestamps: true,
  typecast: true
});

module.exports = mongoose.model('Comment', CommentSchema);