'use strict';

var mongoose = require('mongoose'),
  Report = mongoose.model('Report'),
  User = mongoose.model('Users'),
  config = require('../../config');

exports.Report_list = function (req, res) {
  Report.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'reported_to',
        foreignField: '_id',
        as: 'reported_user'
      }
    }, {
      $lookup: {
        from: 'users',
        localField: 'reported_by',
        foreignField: '_id',
        as: 'reprted_by_user'
      }
    }, { $unwind: "$reported_user" },
  ], function (err, result) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, data: result});
  });
};
exports.add_Report = function (req, res) {
  req.body.reported_by = req.decoded._id;
  let newreport = new Report(req.body);
  newreport.save(function (err, result) {
    if (err)
      res.json({ success: false,message:"Failed to report", error: err });

    res.json({ success: true, data: result });
  });


};

exports.update_a_Report = function (req, res) {
  var _id = req.params.report_id;
  if (!_id) {
    res.json({ success: false, message: "_id not found" });
  }
  Report.findOneAndUpdate({ _id: _id }, req.body, { new: true }, function (err, result) {
    if (err)
      res.json({ success: false, error: err });
    else {
      res.json({ success: true, message: 'Updated successfully', data: result });
    }
  });
};

exports.read_a_Report = function (req, res) {
  var _id = req.params.report_id;
  if (!_id) {
    res.json({ success: false, message: "_id not found" });
  }
  Report.findById(_id, function (err, result) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, data: result });
  });
};

exports.delete_a_Report = function (req, res) {
  var _id = req.params.report_id;
  if (!_id) {
    res.json({ success: false, message: "_id not found" });
  }
  Report.deleteOne({ _id: _id }, function (err, result) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, message: ' Successfully deleted' });
  });
};
