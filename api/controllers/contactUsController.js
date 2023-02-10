'use strict';

var mongoose = require('mongoose'),
  ContactUs = mongoose.model('ContactUs'),
  config = require('../../config');
const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')

  function mail_notification(username, notification_message, click_action = "", sender_id = "", product_id = "", type = "") {
    var transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      auth: {
        user: config.email.user,
        pass: config.email.pass
      }
    })
    transporter.use('compile', hbs({
      viewEngine: {
        extName: '.hbs',
        partialsDir: './api/templates',
        layoutsDir: './api/templates',
        defaultLayout: 'notification_template.hbs',
      }, viewPath: './api/templates', extName: '.hbs'
    }))
   // User.findById(user_id, function (err, user) {
      // if (err)
      //   console.log({ success: false, error: err, message: "Error in Mail notification" });
      // else if (user && user.email) {
        var mailOptions = {
          from: config.email.fromName,
          to:"prakashshaw1406@gmail.com",       //user.email,
          subject: 'Trade Notification',
          template: 'notification_template',
          context: {
            name: username ,
            message: notification_message,
            base_url: config.__site_url,
            image_url: config.__image_url,
            type: type
          }
        }
  
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log({ success: false, message: error });
          } else {
            console.log({ success: true, data: user, mail: info.response });
          }
        });
      // } else {
      //   console.log({ success: false, message: "Email not found" });
      // }
    //})
  
  }
exports.all_contactUs = function(req, res) {
  ContactUs.find(function(err, contactUs) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, data: contactUs });
  });
};

exports.add_contactUs = function(req, res) {

  var new_contactUs = new ContactUs(req.body);
  new_contactUs.save(function(err, contactUs) {
    if (err) {
      res.json({ success: false, message: err });
    } else {
      let message=`${req.body.name} has sent a help request. Please log into Admin Panel for further details.`
        mail_notification('Admin',message)
      res.json({ success: true, data: contactUs, message: 'Success' });

    }
  });
};

exports.read_a_contactUs = function(req, res) {

  var _id = req.params.contactUs_id;
  ContactUs.findById(_id, function(err, contactUs) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, data: contactUs });
  });
};

exports.update_a_contactUs = function(req, res) {
  var _id = req.body._id ;
  ContactUs.findOneAndUpdate({ _id: _id }, req.body, { new: true }, function(err, contactUs) {
    if (err)
      res.json({ success: false, error: err });
    else {
      res.json({ success: true, message: 'ContactUs updated successfully', data: contactUs });
    }
  });
};

exports.delete_a_contactUs = function(req, res) {
  var _id = req.body.contactUsId;
  ContactUs.remove({ _id: _id }, function(err, contactUs) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, message: 'ContactUs successfully deleted' });
  });
};

exports.count= function(req,res){
  ContactUs.count(function (err, cnt) {
      if (err)
          res.json({ success: false, error: err });
      res.json({ success: true, data: { name :'ContactUs',path:'contactUs' ,count:cnt} });
  });
};