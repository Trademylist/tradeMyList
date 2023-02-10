
'use strict';

var mongoose = require('mongoose'),
  Product = mongoose.model('Product'),
  vacancies = mongoose.model('Vacancies'),
  config = require('../../config');


exports.add_job = function (req, res) {
  req.body.user_id = req.decoded._id;
  req.body.country = req.decoded.country;
  var new_vacancies = new Vacancies(req.body);
  new_vacancies.save(function (err, vacancies) {
    if (err) {
      res.json({ success: false, message: err });
    } else {
      res.json({ success: true, data: vacancies, message: 'You have successfully created' });
    }
  });
};

exports.all_vacancies = function (req, res) {
  var country = req.decoded.country;
  if (country && country[0] != null) {//normal admin
    vacancies.find({ country: { $in: country } }, function (err, vacancies) {
      if (err)
        res.json({ success: false, error: err });
      res.json({ success: true, data: vacancies });
    });
  } else {//super admin
    vacancies.find(function (err, vacancies) {
      if (err)
        res.json({ success: false, error: err });

      res.json({ success: true, data: vacancies });
    });
  }
};

exports.read_a_job = function (req, res) {

  var _id = req.params.vacanciesId == undefined ? req.decoded._id : req.params.vacanciesId;
  vacancies.findById(_id, function (err, vacancies) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, data: vacancies });
  });
};

exports.update_a_job = function (req, res) {
  var _id = req.body._id;
  if (!_id) {
    res.json({ success: false, message: "vacancy id not found" });
  }
  vacancies.findOneAndUpdate({ _id: _id }, req.body, { new: true }, function (err, vacancies) {
    if (err)
      res.json({ success: false, error: err });
    res.json({ success: true, message: 'Job updated successfully', data: vacancies });
  });
};

exports.delete_a_job = function (req, res) {
  var _id = req.params._id;
  vacancies.remove({ _id: _id }, function (err, vacancies) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, message: 'Job successfully deleted' });
  });
};

exports.search_a_job = function (req, res) {
  var svalue = req.body.search_value;
  if (!svalue) {
    res.json({ success: false, message: 'search value required' });
  }
  const Regex = new RegExp(svalue, 'i');
  vacancies.find({
    $or: [
      { job_title: Regex },
      { key_skill: Regex }
    ]
  }, function (err, vacancies) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, data: vacancies });
  });
};

exports.count = function (req, res) {
  vacancies.count(function (err, cnt) {
    if (err)
      res.json({ success: false, error: err });
    res.json({ success: true, data: { name: 'Vacancies', path: 'vacancies', count: cnt } });
  });
};
//app user
exports.nearBy = function (req, res) {
  var latitude = parseFloat(req.body.latitude);
  var longitude = parseFloat(req.body.longitude);
  var distance =  10000000000;
  if (!latitude || !longitude) {
    res.json({ success: false, message: 'location not found' });
  }
  vacancies.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [longitude, latitude]        // format [longitude, latitude]
        },
        distanceField: "dist.calculated",
        maxDistance: distance,
        spherical: true
      }
    }
  ]).then(function (result) {
    res.json({ success: true, data: result });

  }).catch();

};
exports.search_user_vacancy = function (req, res) {
  var svalue = req.body.search_value;
  var latitude = parseFloat(req.body.latitude);
  var longitude = parseFloat(req.body.longitude);
  var distance = 1000000;
  if (!latitude || !longitude) {
    res.json({ success: false, message: 'location not found' });
  }
  if (!svalue) {
    res.json({ success: false, message: 'search value required' });
  }
  const Regex = new RegExp(svalue, 'i');
  vacancies.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [longitude, latitude]        // format [longitude, latitude]
        },
        distanceField: "dist.calculated",
        maxDistance: distance,
        spherical: true
      }
    }, {
      $match: {
        $or: [
          { job_title: Regex },
          { key_skill: Regex }
        ]
      }
    }
  ]).then(function (result) {
    res.json({ success: true, data: result });

  }).catch();
};
//app seller
exports.seller_vacancies = function (req, res) {
  var _id = req.decoded._id;
  vacancies.find({user_id:_id},function (err, vacancies) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, data: vacancies });
  });
};
exports.add_vacancies = function (req, res) {
  req.body.user_id = req.decoded._id;
  //req.body.country = req.decoded.country;
  var new_vacancies = new Vacancies(req.body);
  new_vacancies.save(function (err, vacancies) {
    if (err) {
      res.json({ success: false, message: err });
    } else {
      res.json({ success: true, data: vacancies, message: 'You have successfully created' });
    }
  });
};