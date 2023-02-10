'use strict'

let mongoose = require('mongoose'),
  Comment = mongoose.model('Comment'),
  config = require('../../config')

exports.list = function (req, res) {
  Comment.find(function (err, data) {
    if (err)
      res.json({ success: false, error: err })
    let result = []
    data.forEach((element, index) => {
      let output = {}
      output.comment = data[index].comment
      output.sub_comment = data[index].sub_comment
      result.push(output)
    });
    res.json({ success: true, data: result })
  })
}
exports.buyer_tag_list = function (req, res) {
  Comment.find({type:"buyer_tag"},function (err, data) {
    if (err)
      res.json({ success: false, error: err })
    let result = []
    data.forEach((element, index) => {
      result.push(data[index].comment)
    });
    res.json({ success: true, data: result })
  })
}
exports.seller_tag_list = function (req, res) {
  Comment.find({type:"seller_tag"},function (err, data) {
    if (err)
      res.json({ success: false, error: err })
    let result = []
    data.forEach((element, index) => {
      result.push(data[index].comment)
    });
    res.json({ success: true, data: result })
  })
}
exports.add = function (req, res) {
  let new_Comment = new Comment(req.body)
  new_Comment.save(function (err, data) {
    if (err) {
      res.json({ success: false, message: err })
    } else {
      res.json({ success: true, data: data, message: 'successfully created' })
    }
  })
}
exports.delete = function (req, res) {
  let _id = req.params.comment_id
  if (!_id) {
    res.json({ success: false, message: 'id not found' })
  }
  Comment.remove({ _id: _id }, function (err, data) {
    if (err)
      res.json({ success: false, error: err })
    res.json({ success: true, message: 'Deleted' })
  })
}