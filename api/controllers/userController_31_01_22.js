'use strict';

var mongoose = require('mongoose'),
  Product = require('../models/productModel'),
  User = mongoose.model('Users'),
  Review = mongoose.model('Review'),
  ChatBlock = mongoose.model('ChatBlock'),
  config = require('../../config'),
  jwt = require('jsonwebtoken'),
  nodemailer = require('nodemailer'),
  generator = require('generate-password'),
  hbs = require('nodemailer-express-handlebars');
var ObjectID = require('mongodb').ObjectID;
var twilio = require('twilio');
var client = new twilio(config.Account_SID, config.Auth_Token);
var multer = require('multer'),
  path = require('path');
var createCsvWriter = require('csv-writer').createObjectCsvWriter;


const S3Helper = require('../../_helpers/s3Helper');
const stripeHelper = require('../../_helpers/stripeHelper');
//const AppleloginHelper = require('../../_helpers/appleloginHelper');

function randomNumber(length) {
  var chars = '0123456789';
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
}

var transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});

transporter.use('compile', hbs({
  viewEngine: {
    extName: '.hbs',
    partialsDir: './api/templates',
    layoutsDir: './api/templates',
    defaultLayout: 'email_template.hbs',
  }, viewPath: './api/templates', extName: '.hbs'
}));
var transporter2 = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});

transporter2.use('compile', hbs({
  viewEngine: {
    extName: '.hbs',
    partialsDir: './api/templates',
    layoutsDir: './api/templates',
    defaultLayout: 'forgot_password.hbs',
  }, viewPath: './api/templates', extName: '.hbs'
}));
var transporterAdmin = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});

transporterAdmin.use('compile', hbs({
  viewEngine: {
    extName: '.hbs',
    partialsDir: './api/templates',
    layoutsDir: './api/templates',
    defaultLayout: 'forgot_password_admin.hbs',
  }, viewPath: './api/templates', extName: '.hbs'
}));
var transporter3 = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});

transporter3.use('compile', hbs({
  viewEngine: {
    extName: '.hbs',
    partialsDir: './api/templates',
    layoutsDir: './api/templates',
    defaultLayout: 'user_contact.hbs',
  }, viewPath: './api/templates', extName: '.hbs'
}));

function createToken(user) {
  if (user.country) {
    var countries = user.country;//to convert the country format
    var countryArray = [];
    countries.forEach(function (country, index) {
      countryArray.push(country.itemName);
    });
    var tokenData = {
      _id: user._id,
      email: user.email,
      contact: user.contact,
      country: countryArray
    };
  } else {
    var tokenData = {
      _id: user._id,
      email: user.email,
      contact: user.contact,
      notification: user.notification
    };
  }
  var token = jwt.sign(tokenData, config.secret, {
    expiresIn: "100 days"
  });
  return token;
}

exports.user_details = function (req, res) {
  User.findById(req.decoded._id, { password: 0 }, function (err, user) {
    user.path = config.__profile_image_url;
    if (err)
      res.json({ success: false, error: err });
    Review.aggregate([{ $match: { user_id: new ObjectID(req.decoded._id) } },
    {
      $lookup:
      {
        from: 'users',
        localField: 'sender_id',
        foreignField: '_id',
        as: 'joindata'
      }
    }, { $unwind: "$joindata" }, {
      $project: {

        _id: 1,
        user_id: 1,
        product_id: 1,
        user_type: 1,
        description: 1,
        tags: 1,
        rating: 1,
        username: "$joindata.username",
        image: "$joindata.image"
      }
    }
    ], (err2, review) => {
      if (err2)
        res.json({ success: false, error: err2 });
      else {
        var userData = {
          email: user.email,
          image: user.image,
          country: user.country,
          geometry: user.geometry,
          username: user.username,
          address: user.address,
          role: user.role,
          bio: user.bio,
          distance_unit: user.distance_unit,
          userid: user._id,
          notification: user.notification,
          notification_token: user.notification_token,
          contact: user.contact,
          login_type: user.login_type,
          contact_verify: user.contact_verify,
          createdAt: user.createdAt,
          path: config.__profile_image_url
        };
        res.json({ success: true, data: userData, review_details: review });
      }
    })
  });
}
exports.user_edit = function (req, res) {
  console.log(req.body)
  if (req.body.password) {
    var password = req.body.password;
    req.body.password = '';
  } else {
    delete req.body.password;
  }

  var _id = req.decoded._id;
  User.findOneAndUpdate({ _id: _id }, req.body, { new: true }, function (err, user) {
    if (err)
      res.json({ success: false, error: err });
    else {

      if (password) {
        user.password = password;
        user.save(function (err, updatedUser) {
          if (err) {
            res.json({ success: false, message: 'User update failed', data: err });
          } else {
            let token = createToken(user)

            var userData = {
              email: user.email,
              image: user.image,
              country: user.country,
              geometry: user.geometry,
              username: user.username,
              address: user.address,
              role: user.role,
              bio: user.bio,
              distance_unit: user.distance_unit,
              userid: user._id,
              notification: user.notification,
              notification_token: user.notification_token,
              contact: user.contact,
              contact_verify: user.contact_verify,
              login_type: user.login_type,
              token: token,
              path: config.__profile_image_url
            };
            res.json({ success: true, message: 'User updated successfully', data: userData });
          }
        })

      } else {
        let token = createToken(user)
        var userData = {
          email: user.email,
          image: user.image,
          country: user.country,
          geometry: user.geometry,
          username: user.username,
          address: user.address,
          role: user.role,
          bio: user.bio,
          distance_unit: user.distance_unit,
          userid: user._id,
          notification: user.notification,
          notification_token: user.notification_token,
          contact: user.contact,
          contact_verify: user.contact_verify,
          token: token,
          path: config.__profile_image_url
        };
        res.json({ success: true, message: 'User updated successfully', data: userData });
      }

    }
  });
}
exports.all_users = function (req, res) {
  User.find({
    $or: [{ role: 'seller' }, { role: 'user' }
    ]
  }, function (err, user) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, data: user });
  });
}
exports.search_user = function (req, res) {
  var svalue = req.body.search_value;
  if (!svalue) {
    res.json({ success: false, message: 'search value required' });
  }
  const userRegex = new RegExp(svalue, 'i')
  User.find({ email: userRegex }
    , function (err, user) {
      if (err)
        res.json({ success: false, error: err });

      res.json({ success: true, data: user });
    });
}
exports.add_user = function (req, res) {

  var access_token = generator.generate({
    length: 15,
    numbers: true
  });

  req.body.access_token = access_token;

  User.find({ email: req.body.email }, function (err, user) {
    if (err)
      res.json({ success: false, error: err, message: 'Error in server!' });
    else {
      //console.log(user);
      if (user.length > 0) {
        res.json({ success: false, error: err, message: 'User already exists' });
      } else {
        req.body.role = 'seller';
        var new_user = new User(req.body);
        new_user.save(function (err, user) {
          if (err) {
            res.json({ success: false, message: "error in mongodb", err: err });
          } else {
            var mailOptions = {
              from: config.email.fromName,
              to: user.email,
              subject: 'Welcome to Trade',
              template: 'email_template',
              context: {
                title: "Thank you for registering with us.",
                name: user.username ? user.username : 'User',
                url: config.__admin_url + 'emailvalidate/' + user.access_token + '/' + user._id,
                base_url: config.__site_url,
                image_url: config.__image_url
              }
            }

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                res.json({ success: false, message: "Registration error", err: error, info: info });
                console.log(error);
              } else {
                res.json({ success: true, mail: info.response, message: 'An email is sent to your email address. Please verify and login.' });
              }
            });

            //res.json({ success: true, data: user, message: 'An email is sent to your email address. Please verify and login.' });

          }
        });
      }
    }
  });

}
exports.email_change = function (req, res) {
  let email = req.body.email
  if (!email)
    res.json({ success: false, message: 'Empty email' });

  User.find({ email: email }, function (err, user) {
    if (err)
      res.json({ success: false, error: err, message: 'Error in server!' });
    else {
      if (user.length > 0) {
        res.json({ success: false, error: err, message: 'This email already in Use' });
      } else {
        let data = {
          email: email,
          _id: req.decoded._id
        }
        let token = jwt.sign(data, config.secret, {
          expiresIn: "2 days"
        });
        var mailOptions = {
          from: config.email.fromName,
          to: email,
          subject: 'Email change request',
          template: 'email_template',
          context: {
            title: "Activate new email",
            name: user.username ? user.username : 'User',
            // url: config.__admin_url + 'email_change/' + req.decoded._id + '/' + email,
            url: config.__admin_url + 'email_change/?token=' + token,
            base_url: config.__site_url,
            image_url: config.__image_url
          }
        }

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            res.json({ success: false, message: "Registration error", err: error, info: info });
            console.log(error);
          } else {
            res.json({ success: true, data: user, mail: info.response, message: 'An email is sent to the new id. Please verify.' });
          }
        });



        //}
        //});
      }
    }
  });

}
exports.email_validate = function (req, res) {

  var access_token = req.params.access_token;

  User.findOne({ access_token: access_token })
    .exec(function (err, user) {

      if (err) {
        res.json({ success: false, error: err });
      } else {
        if (!user) {
          res.json({ success: false, message: 'Invalid token' });
        } else {

          user.status = 'Active';
          user.email_verify = 'Yes';
          user.save(function (err, updatedUser) {
            if (err) {
              res.send('Server Error ! Please Try after sometime');
            } else {
              res.send('Your account has been activated successfully');
            }
          })
        }
      }
    });
}
exports.login = function (req, res) {
  if (req.body.email && req.body.password) {
    var email = req.body.email;
    User.findOne({ email: email })
      .exec(function (err, user) {
        if (err) {
          res.json({ success: false, error: err });
        } else {
          if (!user) {
            res.json({ success: false, message: "Invalid EmailID" });
          } else {
            if (!user.comparePassword(req.body.password)) {
              res.json({ success: false, message: "Invalid Password" });
            } else if (user.role == 'seller') {
              res.json({ success: false, message: "Only admin Login Allow" });
            } else if (user.role == 'admin' && user.status == 'inactive') {
              res.json({ success: false, message: "Your account still is inactive" });
            } else if (user.role == 'admin' && user.status == 'block') {
              res.json({ success: false, message: "Your account has been blocked by admin" });
            } else {

              user.login_status = true;
              user.save(function (err, updatedUser) {
                if (err) {
                  res.json({ success: false, message: "Login unsuccessful!", error: err });
                } else {
                  var token = createToken(user);
                  var sessData = {
                    name: user.first_name,
                    token: token,
                    role: user.role,
                    userid: user._id,
                    permission: user.permission
                  };
                  res.json({ success: true, data: sessData, message: "Login successfull" });
                }
              });
            }
          }
        }
      })
  } else {
    res.json({ success: false, message: "Email and Password is required" });
  }
}
exports.seller_login = function (req, res) {
  let notification_token = req.body.notification_token ? req.body.notification_token : null
  if (req.body.email && req.body.password) {
    var email = req.body.email;
    User.findOne({ email: email })
      .exec(function (err, user) {
        if (err) {
          res.json({ success: false, error: err });
        } else {
          if (!user) {
            res.json({ success: false, message: "Invalid EmailID" });
          } else {
            if (!user.password) {
              res.json({ success: false, message: "Email is used in social login" })
            } else if (!user.comparePassword(req.body.password)) {
              res.json({ success: false, message: "Invalid Password" });
            } else if (user.email_verify == 'No') {
              res.json({ success: false, message: "Please verify your email" });
            } else if (user.status == 'inactive') {
              res.json({ success: false, message: "Your account still is inactive" });
            } else if (user.status == 'block') {
              res.json({ success: false, message: "Your account has been blocked by admin" });
            } else {
              user.login_status = true
              if (notification_token)
                user.notification_token = notification_token
              user.save(function (err, updatedUser) {
                if (err) {
                  res.json({ success: false, message: "Login unsuccessful!", error: err });
                } else {
                  var token = createToken(user);
                  var sessData = {
                    email: user.email,
                    image: user.image,
                    country: user.country.itemName ? user.country.itemName : null,
                    geometry: user.geometry,
                    username: user.username,
                    address: user.address,
                    token: token,
                    role: user.role,
                    bio: user.bio,
                    distance_unit: user.distance_unit,
                    userid: user._id,
                    login_type: user.login_type,
                    notification: user.notification,
                    contact: user.contact,
                    contact_verify: user.contact_verify,
                    path: config.__profile_image_url
                  };
                  res.json({ success: true, data: sessData, message: "Login successful" });
                }
              });
            }
          }
        }
      })
  } else {
    res.json({ success: false, message: "Email and Password is required" });
  }
}
exports.read_a_user = function (req, res) {

  const _id = req.params.userId;
  if (!_id)
    res.json({ success: false, message: "User id not found" });
  User.findById(_id, { password: 0, role: 0 }, function (err, user) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, data: user });
  });
}
exports.chatuser_list = function (req, res) {
  const idsArray = req.body.chatuser;
  User.find({ _id: { $in: idsArray } }, { password: 0, role: 0 }, function (err, user) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, data: user, path: config.__profile_image_url });
  });
}
exports.update_a_user = function (req, res) {

  if (req.body.password) {
    var password = req.body.password;
    req.body.password = '';
  } else {
    delete req.body.password;
  }

  var _id = req.body._id;
  User.findOneAndUpdate({ _id: _id }, req.body, { new: true }, function (err, user) {
    if (err)
      res.json({ success: false, error: err });
    else {

      if (password) {
        user.password = password;
        user.save(function (err, updatedUser) {
          if (err) {
            res.json({ success: false, message: 'User update failed', data: err });
          } else {
            res.json({ success: true, message: 'User updated successfully', data: user });
          }
        })

      } else {
        res.json({ success: true, message: 'User updated successfully', data: user });
      }

    }
  });
}
exports.delete_a_user = function (req, res) {
  var _id = req.params.userId == undefined ? req.decoded._id : req.params.userId;
  User.remove({ _id: _id }, function (err, user) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, message: 'Deleted' });
  });
}
exports.forgot_password = function (req, res) {
  var password = generator.generate({
    length: 10,
    numbers: true
  });

  if (req.body.email) {
    var email = req.body.email;

    User.findOne({ email: email })
      .exec(function (err, user) {
        if (err) {
          res.json({ success: false, error: err });
        } else {
          if (!user) {
            res.json({ success: false, message: 'Invalid Email' });
          } else {
            var mailOptions = {
              //from: config.email.adminEmail,
              from: config.email.fromName,
              to: user.email,
              subject: 'Trade Forgot Password',
              template: 'forgot_password',
              context: {
                name: user.username ? user.username : 'User',
                new_pass: password,
                base_url: config.__site_url,
                image_url: config.__image_url + '/logo.png'
              }
            };

            transporterAdmin.sendMail(mailOptions, function (error, info) {
              if (error) {
                res.json({ success: false, error: error });
              } else {
                user.password = password;
                user.save(function (err, updatedUser) {
                  if (err)
                    res.json({ success: false, error: err });

                  res.json({ success: true, message: "Please check your mail for new password", data: updatedUser });
                });

              }
            });

          }
        }
      })

  } else {
    res.json({ success: false, message: 'Invalid Email' });
  }
}
exports.change_password = function (req, res) {
  console.log(req);
  User.findById(req.decoded._id, function (err, user) {
    if (err) {
      res.json({ success: false, error: err });
    } else {
      if (!user.comparePassword(req.body.current_password)) {
        res.json({ success: false, message: "Invalid Password" });
      } else {
        user.password = req.body.password;
        user.save(function (err, updatedUser) {
          if (err) res.json({ success: false, error: err });
          res.json({ success: true, message: "Password is updated successfully" });
        });
      }
    }

  });
}
exports.generate_token = function (req, res) {
  let token = createToken(req.body);
  var sessData = {
    token: token,
  };
  res.json({ success: true, message: 'New token', data: sessData });
}
exports.is_valid_token = function (req, res) {
  let token = req.body.token;
  jwt.verify(token, config.secret, function (err, decoded) {
    if (err)
      res.json({ success: false, data: err, message: 'Failed to authenticate token.' });
    else
      res.json({ success: true, data: decoded, message: 'Token verified' });
  });
}
exports.count = function (req, res) {
  User.count({ role: 'user' }, function (err, cnt) {
    if (err)
      res.json({ success: false, error: err });
    res.json({ success: true, data: { name: 'Seller', path: 'seller', count: cnt } });
  });
}
exports.add_admin = function (req, res) {
  var access_token = generator.generate({
    length: 15,
    numbers: true
  });
  var pswd_generate = generator.generate({
    length: 15,
    numbers: true
  });
  /* var countries= req.body.country;//to convert the country format
   var countryArray=[];
   countries.forEach(function (country, index) {
      countryArray.push(country.itemName) ; 
   });*/
  //req.body.country= countryArray;
  req.body.access_token = access_token;
  req.body.role = 'admin';
  req.body.email_verify = 'Yes';
  req.body.status = 'Active';
  req.body.password = pswd_generate;

  User.find({ email: req.body.email }, function (err, user) {
    if (err)
      res.json({ success: false, error: err, message: 'Error in server!' });
    else {

      if (user.length > 0) {
        res.json({ success: false, error: err, message: 'User already exists' });
      } else {
        var new_user = new User(req.body);
        new_user.save(function (err, user) {
          if (err) {
            res.json({ success: false, message: err });
          } else {
            res.json({ success: true, data: user, message: 'You have successfully registered' });

            var mailOptions = {
              from: config.email.fromName,
              to: user.email,
              subject: 'Welcome to Trade',
              template: 'user_contact',
              context: {
                email: user.email,
                password: req.body.password
              }
            }

            /*transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                res.json({ success: false, message: error });
              } else {
                res.json({ success: true, data: user, mail: info.response, message: 'You have successfully registered' });
              }
            });*/

          }
        });
      }
    }
  });
}
exports.all_admin = function (req, res) {
  User.find({ role: 'admin' }, function (err, user) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, data: user });
  });
}
exports.search_admin = function (req, res) {
  var svalue = req.body.search_value;
  if (!svalue) {
    res.json({ success: false, message: 'search value required' });
  }
  const userRegex = new RegExp(svalue, 'i')
  User.find({ email: userRegex, role: 'admin' }
    , function (err, user) {
      if (err)
        res.json({ success: false, error: err });

      res.json({ success: true, data: user });
    });
}
//using file uploader
exports.upload = function (req, res) {
  if (req.files) {
    var media = req.files.file;
    var mimetype = media.mimetype.split('/');
    var mediatype = mimetype[0];
    var ext = media.name.slice(media.name.lastIndexOf('.'));
    var ver = parseInt(Math.random() * 1000000);
    var fileName = 'profile' + Date.now() + ver + ext;

    var filePath = './uploads/profileImages/' + fileName;
    //upload 
    media.mv(filePath, function (err) {
      if (!err) {
        req.body.image = fileName;
        User.findById(req.decoded._id).then(function (product) {
          if (!product.image) {
            console.log("Previous Image file not found ");
          } else {
            var path = './uploads/profileImages/' + product.image;
            require("fs").unlink(path, (err) => {
              if (!err)
                console.log("Deleted successfully");
              else
                console.log("Deleted failed ", err);
            })
          }
          User.findOneAndUpdate({ _id: req.decoded._id }, req.body, function (err, user) {
            if (err)
              res.json({ success: false, message: err });
            res.json({ success: true, message: "Success", data: { image: fileName, path: config.__profile_image_url } });
          });
        })

      } else {
        res.json({ success: false, message: "Upload Failed", err: err });
      }
    });
  } else {
    res.json({ success: false, message: " Not Found" });
  }
}
//using multer
exports.upload_image = function (req, res, next) {
  var upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './uploads/profileImages/')
      },
      filename: function (req, file, cb) {
        cb(null, 'profile' + Date.now() + parseInt(Math.random() * 100) + path.extname(file.originalname))


      }
    })
  })
  return upload.array('file', 1)(req, res, next); //can use for multiple upload too
};
exports.add_image = function (req, res) {
  var image = [];
  req.files.forEach(function (val, index) {
    image.push(req.files[index].filename);
  })
  req.body.image = image[0];
  User.findOneAndUpdate({ _id: req.decoded._id }, req.body, function (err, user) {
    if (err)
      res.json({ success: false, message: err });
    res.json({ success: true, message: "Success", data: { image: image[0], path: config.__profile_image_url } });
  });

}
exports.block_user = (req, res) => {
  let user_id = new ObjectID(req.body.block_user_id);
  if (!user_id)
    res.json({ success: false, message: "Empty block user" })
  console.log(req.decoded._id, " ", JSON.stringify(req.decoded._id))
  Product.update({
    $and: [
      { user_id: user_id },
      {
        "likelist":
        {
          $elemMatch: { $eq: req.decoded._id }
        }
      }
    ]
  }, { $pull: { "likelist": req.decoded._id } }, { multi: true }, (err, data) => {
    if (err)
      console.log({ success: false, message: "Failed to block", err: err })
  }
  )
  User.findByIdAndUpdate(req.decoded._id, { $push: { block_user_id: user_id } }, (err, data) => {
    if (err)
      res.json({ success: false, message: "Failed to block", err: err })

    res.json({ success: true, message: "User blocked", data: data })

  })
}
exports.block_list = (req, res) => {
  User.findById(req.decoded._id, (err, data) => {
    if (err)
      res.json({ success: false, message: "Failed to unblock", err: err })
    let blocked_id = []
    data.block_user_id.forEach(element => {
      blocked_id.push(ObjectID(element))
    });
    User.find({ _id: { $in: blocked_id } }, { password: 0 }, (err, data) => {
      if (err)
        res.json({ success: false, message: "blocklist generation failed", err: err })

      res.json({ success: true, data: data })

    })
  })
}
exports.unblock_user = (req, res) => {
  let user_id = req.body.block_user_id;
  User.findByIdAndUpdate(req.decoded._id, { $pull: { block_user_id: user_id } }, (err, data) => {
    if (err)
      res.json({ success: false, message: "Failed to unblock", err: err })

    res.json({ success: true, message: "User Unblocked", data: data })

  })
}

exports.social_login = function (req, res) {
  console.log(req.body)
  let email = req.body.email ? req.body.email : "",
    socialId = req.body.socialId ? req.body.socialId : "",
    notification_token = req.body.notification_token ? req.body.notification_token : "",
    username = req.body.username ? req.body.username : "",
    image = req.body.image ? req.body.image : "";
  User.findOne({
    $and: [
      { email: email }
      // ,
      // { socialId: socialId }
    ]
  }, function (err, user) {
    if (err)
      res.json({ success: false, error: err, message: 'Error in server!' });
    else {
      if (user) {                                                           // social login next time          
        if (notification_token)
          User.findOneAndUpdate({ email: email }, { $set: { notification_token: notification_token, image: image } }, (err, user) => { if (err) console.log(err) })
        var token = createToken(user);
        var sessData = {
          email: user.email,
          image: user.image,
          country: user.country.itemName ? user.country.itemName : null,
          geometry: user.geometry,
          username: user.username,
          address: user.address,
          token: token,
          role: user.role,
          bio: user.bio,
          distance_unit: user.distance_unit,
          userid: user._id,
          login_type: user.login_type,
          notification: user.notification,
          contact: user.contact,
          contact_verify: user.contact_verify,
          path: config.__profile_image_url
        };
        res.json({ success: true, data: sessData, message: "Login successfully" });
      } else {
        User.find({ email: email }, function (err, data) {
          if (data.length > 0)
            res.json({ success: false, message: 'Email registered using different social login' });
          else {
            var details = { //social login 1st time
              "email": req.body.email,
              "username": username,
              "notification_token": notification_token,
              "login_type": req.body.login_type,
              "socialId": req.body.socialId,
              "image": req.body.image
            }
            var new_user = new User(details);
            new_user.save(function (err, user) {
              if (err) {
                res.json({ success: false, error: err });
              } else {
                var token = createToken(user);
                var sessData = {
                  email: user.email,
                  image: user.image,
                  country: user.country.itemName ? user.country.itemName : null,
                  geometry: user.geometry,
                  username: user.username,
                  address: user.address,
                  token: token,
                  role: user.role,
                  bio: user.bio,
                  distance_unit: user.distance_unit,
                  userid: user._id,
                  login_type: user.login_type,
                  notification: user.notification,
                  contact: user.contact,
                  contact_verify: user.contact_verify,
                  path: config.__profile_image_url
                };
                res.json({ success: true, data: sessData, message: "Login successfully" });
              }
            })
          }

        })
      }
    }
  })
};

exports.send_verification = (req, res) => {
  let code = randomNumber(4),
    email = req.body.email
  if (!email)
    res.json({ success: false, message: "email not found" });
  User.findOneAndUpdate({ email: email }, {
    $set: {
      "access_token": code
    }
  }, (err, data) => {
    if (err)
      res.json({ success: false, error: err, message: "Sending fail" });
    if (data) {
      var mailOptions = {
        //from: config.email.adminEmail,
        from: config.email.fromName,
        to: data.email,
        subject: 'Trade Forgot Password',
        template: 'forgot_password',
        context: {
          name: data.username ? data.username : 'User',
          code: code,
          base_url: config.__site_url,
          image_url: config.__image_url + '/logo.png',
          url: `https://trademylist.com/forgot-password/${code}`
        }
      };

      transporter2.sendMail(mailOptions, function (error, info) {
        console.log(info)
        if (error)
          res.json({ success: false, error: error });
        else {
          console.log(info)
          res.json({ success: true, message: "Please check your mail for confirmation code" });
        }
      });
    } else {
      res.json({ success: false, message: "Email not found" });
    }
  })
}
exports.check_verification = (req, res) => {
  let { code, email } = req.body
  if (code && email) {
    User.findOne({ $and: [{ email: email }, { access_token: code }] }, (err, user) => {
      if (err)
        res.json({ success: false, message: "Error occur", error: err })
      if (user) {
        res.json({ success: true, message: "Success" })
      } else {
        res.json({ success: false, message: "Invalid confirmation code " })
      }
    })
  } else {
    res.json({ success: false, message: "Field missing" })
  }

}
exports.change_password_verification = function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      res.json({ success: false, error: err });
    } else {

      if (!user) {

        res.json({ success: false, message: 'Invalid userId' })

      } else {

        user.password = req.body.password;
        user.access_token = null
        user.save(function (err, updatedUser) {
          if (err) res.json({ success: false, error: err });
          res.json({ success: true, message: "Password is updated successfully" });
        });

      }
    }

  });
}
exports.send_mobile_verification = (req, res) => {
  console.log(req.body)
  let exp = Math.floor(Date.now() / 1000)
  exp += 5 * 60; //five minute 
  let code = randomNumber(4),
    contact = req.body.contact,
    notification_token = req.body.notification_token ? req.body.notification_token : ""

  if (!contact)
    res.json({ success: false, message: "Contact not found" });
  User.find({ contact: contact }, (err, data) => {
    if (err)
      res.json({ success: false, message: "Error occur in Query", error: err })

    if (data.length > 0) {
      console.log("second")
      User.update({ contact: contact }, {
        $set: {
          "otp_code": code,
          "otp_expAt": exp,
          "contact": contact,
        }
      }, (err, data) => {
        if (err)
          res.json({ success: false, error: err, message: "Sending fail" });
        client.messages.create({
          to: contact,
          from: config.Sender_number,
          body: `Your OTP is ${code} for Trade app O+x2xlnNg01`
        })
          .then(message => res.json({ success: true, message: "Success" }))
          .catch(err => res.json({ success: false, message: "failed", err: err }))
      })
    } else {
      var details = {
        "contact": contact,
        "login_type": "Phone number",
        "otp_code": code,
        "otp_expAt": exp,
        "notification_token": notification_token
      }
      var new_user = new User(details);
      new_user.save(function (err, user) {
        if (err) {
          res.json({ success: false, error: err });
        } else {
          client.messages.create({
            to: contact,
            from: config.Sender_number,
            body: `Your OTP is ${code} for Trade app O+x2xlnNg01`
          })
            .then(message => res.json({ success: true, message: "Success" }))
            .catch(err => res.json({ success: false, message: "failed", err: err }))
        }
      })
    }
  })
}

exports.check_mobile_verification = (req, res) => {
  let code = req.body.code,
    contact = req.body.contact,
    timenow = Math.floor(Date.now() / 1000)
  if (!code)
    res.json({ success: false, message: "code not found" });
  User.find({
    $and: [
      { contact: contact },
      { otp_code: { $eq: code } },
      { otp_expAt: { $gte: timenow } }
    ]
  }, (err, data) => {
    if (err)
      res.json({ success: false, error: err, message: "failed to verify" });
    else {
      if (data.length == 1) {
        // User.update({ _id: data[0]._id }, { $set: { "contact_verify": 'Yes' } }, (err, data) => {
        //   if (err)
        //     console.log(err)
        // })
        // res.json({ success: true, message: "Success" });
        var token = createToken(data[0]);
        var sessData = {
          contact: data[0].contact,
          image: data[0].image,
          country: null,
          geometry: data[0].geometry,
          username: data[0].username,
          address: data[0].address,
          token: token,
          role: data[0].role,
          bio: data[0].bio,
          distance_unit: data[0].distance_unit,
          userid: data[0]._id,
          login_type: data[0].login_type,
          notification: data[0].notification,
          contact: data[0].contact,
          contact_verify: data[0].contact_verify,
          path: config.__profile_image_url
        };
        res.json({ success: true, data: sessData, message: "Login successfully" });
      }
      else
        res.json({ success: false, message: "Otp code is invalid" });
    }
  })
}

exports.contact_login = (req, res) => {
  let contact = req.body.contact,
    notification_token = req.body.notification_token ? req.body.notification_token : "",
    username = req.body.username ? req.body.username : ""
  if (!contact)
    res.json({ success: false, message: "Invalid Contact" })
  User.find({ contact: contact }, (err, data) => {
    if (err)
      res.json({ success: false, message: "Error occur in Query", error: err })

    if (data.length > 0) {
      console.log("second")
      if (notification_token)
        User.findOneAndUpdate({ contact: contact }, { $set: { notification_token: notification_token } }, (err, user) => { if (err) console.log(err) })
      var token = createToken(data[0]);
      var sessData = {
        contact: data[0].contact,
        image: data[0].image,
        country: null,
        geometry: data[0].geometry,
        username: data[0].username,
        address: data[0].address,
        token: token,
        role: data[0].role,
        bio: data[0].bio,
        distance_unit: data[0].distance_unit,
        userid: data[0]._id,
        login_type: data[0].login_type,
        notification: data[0].notification,
        contact: data[0].contact,
        contact_verify: data[0].contact_verify,
        path: config.__profile_image_url
      };
      res.json({ success: true, data: sessData, message: "Login successfully" });
    } else {
      console.log("first")
      var details = {
        "contact": contact,
        "username": username,
        "notification_token": notification_token,
        "login_type": "Phone number"
      }
      var new_user = new User(details);
      new_user.save(function (err, user) {
        if (err) {
          res.json({ success: false, error: err });
        } else {
          var token = createToken(user);
          var sessData = {
            contact: user.contact,
            image: user.image,
            country: user.country.itemName ? user.country.itemName : null,
            geometry: user.geometry,
            username: user.username,
            address: user.address,
            token: token,
            role: user.role,
            bio: user.bio,
            distance_unit: user.distance_unit,
            userid: user._id,
            login_type: user.login_type,
            notification: user.notification,
            contact: user.contact,
            contact_verify: user.contact_verify,
            path: config.__profile_image_url
          };
          res.json({ success: true, data: sessData, message: "Login successfully" });
        }
      })
    }

  })

}

exports.addprofile = (req, res) => {
  var image = [];
  req.files.forEach(function (val, index) {
    image.push(req.files[index].location);
  })
  req.body.image = image[0];
  User.findOne({ _id: req.decoded._id }, function (err, user) {
    if (err)
      console({ success: false, message: err });
    else {
      User.findOneAndUpdate({ _id: req.decoded._id }, req.body, function (err, user) {
        if (err)
          res.json({ success: false, message: err });
        S3Helper.removeObj(config.AWS_S3_BUCKET, user.image)
        res.json({ success: true, message: "Success", data: { image: image[0] } });
      });
    }


  });

}

exports.add_chatBlock = function (req, res) {

  var new_chatBlock = new ChatBlock(req.body);
  new_chatBlock.user_id = req.decoded._id;
  new_chatBlock.save(function (err, data) {
    if (err) {
      res.json({ success: false, message: err });
    } else {

      res.json({ success: true, data: data, message: 'successfully created' });

    }
  });
};
exports.chatBlock_list = function (req, res) {
  const user_id = req.decoded._id
  ChatBlock.find({ user_id: user_id }, function (err, data) {
    if (err)
      res.json({ success: false, error: err });
    else {
      res.json({ success: true, data: data });
    }
  });
};

exports.delete_a_chatBlock = function (req, res) {
  var _id = req.params.chatBlock_id;
  ChatBlock.remove({ _id: _id }, function (err, data) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, message: 'successfully deleted' });
  });
};

exports.token = async (req, res) => {
  try {
    const token = await stripeHelper.createToken(req.body)
    res.send(token)
  } catch (error) {
    res.send(error)
  }

}

exports.charge = async (req, res) => {
  try {
    req.body.amount *= 100;
    const charge = await stripeHelper.createCharge(req.body)
    res.send(charge)
  } catch (error) {
    res.send(error)
  }
}


exports.userConvertInCSVFile = async (req, res) => {
  const csvWriter = createCsvWriter({
    path: './uploads/seller.csv',
    header: [
      { id: 'email', title: 'Email' },
      { id: 'username', title: 'Username' },
      { id: 'role', title: 'Role' },
      { id: 'address', title: 'Address' },
      { id: 'socialId', title: 'SocialId' },
      { id: 'contact', title: 'Contact' },
      { id: 'status', title: "Status" },
      { id: 'email_verify', title: "Email Verify" },
      { id: 'createdAt', title: "Created Date" }
    ]
  });
  let records = [];
  let user = await User.find({
    $or: [{ role: 'seller' }, { role: 'user' }
    ]
  });

  user.forEach(element => {
    console.log("user===", element.email_verify ? element.email_verify : "NaN")
    records.push({
      email: (element.email ? element.email : "NaN"),
      username: (element.username ? element.username : "NaN"),
      role: (element.role ? element.role : "NaN"),
      address: (element.address ? element.address : "NaN"),
      socialId: (element.socialId ? element.socialId : "NaN"),
      contact: (element.contact ? element.contact : "NaN"),
      status: (element.status ? element.status : "NaN"),
      email_verify: (element.email_verify ? element.email_verify : "NaN"),
      createdAt: (element.createdAt ? new Date(element.createdAt).toISOString() : "NaN")
    })
  });

  csvWriter.writeRecords(records)
    .then(() => {
      console.log('...Done');
      let path = config.__admin_url + "seller.csv";
      // let path = config.__local_url+"seller.csv";
      return res.status(200).send({ success: true, csvFilePath: path });
    });
}

exports.updateAdminAndSuperAdminDetails = async (req, res) => {
  let userId = req.decoded._id;
  let user = await User.findById(userId);
  if (user.email == req.body.email) delete req.body.email;
  const isDuplicate = await User.findOne({ email: req.body.email });
  if (isDuplicate) return res.json({ success: false, message: "Email is already used" });
  for (let key in req.body) {
    user[key] = req.body[key];
  }
  try {
    let updateUser = await user.save();
    return res.json({ success: true, data: updateUser, message: "Successfully updated your account" });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Oops Somthing Wrong" });
  }
}

exports.add_admin_new = function (req, res) {
  var access_token = generator.generate({ length: 15, numbers: true });
  var pswd_generate = generator.generate({ length: 15, numbers: true });
  req.body.access_token = access_token;
  req.body.role = 'admin';
  req.body.email_verify = 'Yes';
  req.body.status = 'Active';
  req.body.password = pswd_generate;

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) res.json({ success: false, error: err, message: 'Error in server!' });
    else {
      if (user) {
        if (user.role == 'admin') return res.json({ success: false, message: 'This email already exists as a admin' });
        user.role = 'admin';
        user.password = req.body.password;
        user.permission = req.body.permission;
        user.username = req.body.username;
        user.save(function (err, saveData) {
          if (err) res.json({ success: false, message: err });
          var mailOptions = {
            from: config.email.fromName,
            to: saveData.email,
            subject: 'Welcome to Trade',
            template: 'user_contact',
            context: {
              email: saveData.email,
              password: req.body.password
            }
          }
          transporter3.sendMail(mailOptions, function (error, info) {
            if (error) {
              res.json({ success: false, message: error });
            } else {
              res.json({ success: true, data: saveData, mail: info.response, message: 'You have successfully registered' });
            }
          });
        })
      } else {
        var new_user = new User(req.body);
        new_user.save(function (err, user) {
          if (err) {
            res.json({ success: false, message: err });
          } else {
            // res.json({ success: true, data: user, message: 'You have successfully registered' });
            var mailOptions = {
              from: config.email.fromName,
              to: user.email,
              subject: 'Welcome to Trade',
              template: 'user_contact',
              context: {
                email: user.email,
                password: req.body.password
              }
            }
            transporter3.sendMail(mailOptions, function (error, info) {
              if (error) {
                res.json({ success: false, message: error });
              } else {
                res.json({ success: true, data: user, mail: info.response, message: 'You have successfully registered' });
              }
            });
          }
        });
      }
    }
  });
}

//new update 28.12.21
exports.changeEmail = async (req, res) => {
  const email = req.body.email;
  try {
    const userdetails = await User.find({ email: email })
    if (userdetails.length > 0) {
      res.json({ success: true, message: 'Email already in use' });
    } else {
      const user = await User.findById(req.decoded._id)
      user.email = email;
      const token = await createToken(user)
      var mailOptions = {
        from: config.email.fromName,
        to: email,
        subject: 'Email Update Notification',
        template: 'email_template',
        context: {
          title: "Requested for Email change",
          name: user.username ? user.username : 'User',
          url: config.__admin_url + 'app_user/validation/' + token,
          base_url: config.__site_url,
          image_url: config.__image_url
        }
      }

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.json({ success: false, message: "Mail sending error", err: error, info: info });
          console.log(error);
        } else {
          res.json({ success: true, mail: info.response, message: 'Mail send successfully' });
        }
      });
    }

  } catch (error) {
    res.json({ success: false, message: error });
  }

}

exports.emailValidation = async (req, res, next) => {
  const decoded = await jwt.verify(req.params.token, config.secret)
  const email = decoded.email;
  try {
    const userUpdate = await User.findOneAndUpdate({ _id: decoded._id }, { $set: { email: email } })
    console.log(userUpdate)
    res.render('emailconfirmation', { title: 'email has been activated successfully.', logo: config.__site_url + 'mainlogo.png' });
  } catch (error) {
    res.render('emailconfirmation', { title: error, logo: config.__site_url + 'mainlogo.png' });
  }

};