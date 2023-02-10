var express = require('express');
var router = express.Router();
var config = require('../../config');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Trade', logo: config.__site_url + 'logo.png' });
});
router.get('/app_user/check', function (req, res, next) {
  res.render('indexcheck', { title: 'Trade', logo: config.__site_url + 'logo.png' });
});
router.get('/emailvalidate/:access_token?/:_id?', function (req, res, next) {
  var access_token = req.params.access_token,
    _id = req.params._id
  console.log(_id, " ", access_token)
  if (_id && access_token) {
    User.findOne({ $and: [{ _id: _id }, { access_token: access_token }] })
      .exec(function (err, user) {
        if (err) {
          res.json({ success: true, message: err })
        } else {
          if (!user)
            res.json({ success: true, message: "user not found" })
          else {
            user.status = 'Active';
            user.email_verify = 'Yes';
            user.save(function (err, updatedUser) {
              if (err)
                res.render('emailconfirmation', { title: err, logo: config.__site_url + 'mainlogo.png' });
              else
                res.render('emailconfirmation', { title: 'Your account has been activated successfully.', logo: config.__site_url + 'mainlogo.png' });
            })
          }
        }
      });
  } else {
    res.json({ success: true, message: "Invalid" })
  }
});

router.get('/app_user/emailregistered/:access_token?/:_id?', function (req, res, next) {
  var access_token = req.params.access_token,
    _id = req.params._id
  if (_id && access_token) {
    User.findOne({ $and: [{ _id: _id }, { access_token: access_token }] })
      .exec(function (err, user) {
        if (err) {
          res.json({ success: false })
        } else {
          if (!user)
            res.json({ success: false })
          else {
            user.status = 'Active';
            user.email_verify = 'Yes';
            user.save(function (err, updatedUser) {
              if (err)
                res.json({ success: false })
              else
                res.json({ success: true })
            })
          }
        }
      });
  } else {
    res.json({ success: false })
  }
});

router.get('/email_change/:user_id?/:email?', function (req, res, next) {
  let _id = req.params.user_id
  let email = req.params.email

  User.findByIdAndUpdate(_id, { email: email }, function (err, user) {
    if (err)
      res.render('emailconfirmation', { title: err, logo: config.__site_url + 'mainlogo.png' });
    else {
      res.render('emailconfirmation', { title: 'New email activated successfully.', logo: config.__site_url + 'mainlogo.png' });
    }

  })


});

router.put('/email_change/:user_id?/:email?', function (req, res, next) {
  let _id = req.params.user_id
  let email = req.params.email

  User.findByIdAndUpdate(_id, { email: email }, function (err, user) {
    if (err)
    res.json({ success: false, error: err,message:"Email id verification unsuccessful" });
    else {
      res.json({ success: true, message: "New email id verified" });
    }

  })


});
module.exports = router;
