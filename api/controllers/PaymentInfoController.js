'use strict';

var mongoose = require('mongoose'),
PaymentInfo = mongoose.model('PaymentInfo'),
AmountInfo =mongoose.model('AmountInfo');
  
exports.get_amount= (req,res)=>{
  const currency_code= req.params.currency_code
  const type=req.params.type
  AmountInfo.findOne({$and:[{currency_code:currency_code},{paymentType:type}]},{amount:1,_id:0},function(err, data) {
    if (err)
      res.json({ success: false, error: err });
    
      res.json({ success: true, data:data  });

  })
}

exports.add_amount= (req,res)=>{
  var new_amount = new AmountInfo(req.body);
  new_amount.save(function(err, amount) {
    if (err) {
      res.json({ success: false, message: err });
    } else {

      res.json({ success: true, data: amount, message: 'success' });

    }
  });
}

exports.all_payment = function(req, res) {
  PaymentInfo.find(function(err, payment) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, data: payment });
  });
};

exports.add_payment = function(req, res) {

  var new_payment = new PaymentInfo(req.body);
  new_payment.save(function(err, payment) {
    if (err) {
      res.json({ success: false, message: err });
    } else {

      res.json({ success: true, data: payment, message: 'success' });

    }
  });
};

exports.user_payment = function(req, res) {
  var _id = req.decoded.user_id;
  PaymentInfo.find({user_id:_id}, function(err, payment) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, data: payment });
  });
};

exports.delete_a_payment = function(req, res) {
  var _id = req.params.paymentId ;
  PaymentInfo.remove({ _id: _id }, function(err, payment) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, message: 'Payment successfully deleted' });
  });
};

