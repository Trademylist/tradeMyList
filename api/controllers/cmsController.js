'use strict';

var mongoose = require('mongoose'),
  Cms = mongoose.model('Cms'),
  config = require('../../config');


exports.all_cms = function(req, res) {
  Cms.find(function(err, cms) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, data: cms });
  });
};

exports.add_cms = function(req, res) {

  var new_cms = new Cms(req.body);
  new_cms.save(function(err, cms) {
    if (err) {
      res.json({ success: false, message: err });
    } else {

      res.json({ success: true, data: cms, message: 'Cms successfully created' });

    }
  });
};
exports.cms_by_name = function(req, res) {

  var page_name = req.params.page_name;
  Cms.find({page_name:page_name}, function(err, cms) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, data: cms });
  });
};
exports.read_a_cms = function(req, res) {

  var _id = req.params.cms_id;
  Cms.findById(_id, function(err, cms) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, data: cms });
  });
};

exports.update_a_cms = function(req, res) {
  var _id = req.body._id ;
  Cms.findOneAndUpdate({ _id: _id }, req.body, { new: true }, function(err, cms) {
    if (err)
      res.json({ success: false, error: err });
    else {
      res.json({ success: true, message: 'Cms updated successfully', data: cms });
    }
  });
};

exports.delete_a_cms = function(req, res) {
  var _id = req.params.cmsId == undefined ? req.decoded._id : req.params.cmsId;
  Cms.remove({ _id: _id }, function(err, cms) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, message: 'Cms successfully deleted' });
  });
};

exports.count= function(req,res){
  Cms.count(function (err, cnt) {
      if (err)
          res.json({ success: false, error: err });
      res.json({ success: true, data: { name :'Cms',path:'cms' ,count:cnt} });
  });
};