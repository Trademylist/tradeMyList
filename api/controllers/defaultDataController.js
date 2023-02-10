'use strict';

var mongoose = require('mongoose'),
  defaultData = mongoose.model('defaultData'),
  config = require('../../config');

const S3Helper = require('../../_helpers/s3Helper');


exports.add_default = function (req, res) {
  if (req.files)
    req.body.image = req.files[0].location

  var new_default = new defaultData(req.body);
  new_default.save(function (err, data) {
    if (err) {
      res.json({ success: false, message: err });
    } else {

      res.json({ success: true, data: data, message: 'defaultData successfully created' });

    }
  });
};
exports.getDistance = function (req, res) {
  var type = "distance";
  defaultData.find({ type: type }, function (err, data) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, data: data });
  });
};
exports.getByName = function (req, res) {
  var type = req.params.type;
  if (!type)
    res.json(" Mandatory field missing ")
  console.log(type)
  defaultData.find({ type: type }, function (err, data) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, data: data });
  });
};

exports.update_a_default = function (req, res) {
  if (req.files[0])
    req.body.image = req.files[0].location
  var _id = req.body._id;
  defaultData.findById(_id, (err, data) => {
    if (req.files[0])
      S3Helper.removeObj(config.AWS_S3_BUCKET, data.image);
    defaultData.findOneAndUpdate({ _id: _id }, req.body, { new: true }, function (err, data) {
      if (err)
        res.json({ success: false, error: err });
      else {
        res.json({ success: true, message: 'defaultData updated successfully', data: data });
      }
    });
  })

};

exports.delete_a_default = function (req, res) {
  var _id = req.params.id;
  defaultData.remove({ _id: _id }, function (err, data) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, message: 'defaultData successfully deleted' });
  });
};
