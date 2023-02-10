'use strict';
var mongoose = require('mongoose'),
  Currencies = mongoose.model('Currencies');

exports.list = (req, res) => {
  Currencies.find({}, { population: 0 }, function (err, currency) {
    if (err)
      res.json({ success: false, error: err });
    res.json({ success: true, data: currency });
  });
};
exports.add = function (req, res) {

  var new_Currencies = new Currencies(req.body);
  new_Currencies.save(function (err, data) {
    if (err) {
      res.json({ success: false, message: err });
    } else {

      res.json({ success: true, data: data, message: 'Cms successfully created' });

    }
  });
};

exports.currency_by_name = function (req, res) {

  var countryName = req.body.country;
  Currencies.find({ countryName: countryName }, function (err, data) {
    if (err)
      res.json({ success: false, error: err });
    const cCode = data.length ? data[0].currencyCode : "";
    res.json({ success: true, code: cCode });
  });
};