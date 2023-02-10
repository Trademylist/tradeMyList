'use strict';

var mongoose = require('mongoose'),
Suggest = mongoose.model('Suggest'),
  config = require('../../config');


exports.list = function(req, res) {
    Suggest.find(function(err, data) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, data: data });
  });
};
exports.add = function(req, res) {
    var new_Suggest = new Suggest(req.body);
    new_Suggest.save(function(err, data) {
      if (err) {
        res.json({ success: false, message: err });
      } else {
        res.json({ success: true, data: data, message: 'successfully created' });
      }
    });
  };

  exports.delete = function (req, res) {
    var _id = req.params.suggest_id;
    if (!_id) {
        res.json({ success: false, message: 'id not found' });
    }
    Suggest.remove({ _id: _id }, function (err, data) {
        if (err)
            res.json({ success: false, error: err });
        res.json({ success: true, message: 'Deleted' });
    });
};