'use strict';
var mongoose = require('mongoose'),
  FCM = require('fcm-node'),
  Product = require('../models/productModel'),
  Freebies = require('../models/freebiesModel'),
  User = mongoose.model('Users'),
  config = require('../../config'),
  nodemailer = require('nodemailer'),
  notificationController = require('./notificationController'),
  hbs = require('nodemailer-express-handlebars');
var multer = require('multer'),
  path = require('path');
const { compare } = require('bcrypt-nodejs');
const { throws } = require('assert');
var ObjectID = require('mongodb').ObjectID;
const S3Helper = require('../../_helpers/s3Helper');
const MilesCountryList = ["USA", "US", "United States", "LBR", "Liberia", "MMR", "Myanmar", "Myanmar (Burma)"]


exports.upload_image = function (req, res, next) {
  var upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './uploads/productImages/')
      },
      filename: function (req, file, cb) {
        cb(null, 'product_' + Date.now() + parseInt(Math.random() * 100) + path.extname(file.originalname))


      }
    })
  })
  return upload.array('file', 12)(req, res, next);
};
exports.image_response = function (req, res) {
  var image = [];
  req.files.forEach(function (val, index) {
    image.push(req.files[index].filename);
  })

  res.json({ success: true, message: "Success", data: { image: image[0], path: config.__image_url } });
}

exports.chatProduct = function (req, res) {
  var product_ids = req.body.chatproduct;
  let product = [];
  if (!product_ids) {
    res.json({ success: false, message: "Product_id not found" });
  }
  Product.find({ _id: { $in: product_ids } }, function (err, product1) {
    if (err)
      res.json({ success: false, message: "db error", err: err });
    Freebies.find({ _id: { $in: product_ids } }, function (err, product2) {
      if (err)
        res.json({ success: false, message: "db error", err: err });
      product = [...product1, ...product2];
      res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
    })
  })
}
exports.chatListDetail = function (req, res) {
  let sender_ids = req.body.sender,
    receiver_ids = req.body.receiver,
    product_ids = req.body.product,
    product = [], result = [];
  if (!sender_ids && !receiver_ids && !product_ids) {
    res.json({ success: false, message: "id not found" });
  }
  Product.find({ _id: { $in: product_ids } }, { product_name: 1, user_id: 1, cover_thumb: 1 }, function (err, product1) {
    if (err)
      res.json({ success: false, message: "db error", err: err });
    Freebies.find({ _id: { $in: product_ids } }, { product_name: 1, user_id: 1, cover_thumb: 1 }, function (err, product2) {
      if (err)
        res.json({ success: false, message: "db error", err: err });
      product = [...product1, ...product2];

      User.find({ _id: { $in: receiver_ids } }, { username: 1, image: 1 }, function (err, receiver) {
        if (err)
          res.json({ success: false, message: "db error", err: err });
        User.find({ _id: { $in: sender_ids } }, { username: 1, image: 1 }, function (err, sender) {
          if (err)
            res.json({ success: false, message: "db error", err: err });


          sender_ids.forEach((element, index) => {
            let temp = {}
            sender.forEach(inner_element1 => {
              if (element == inner_element1._id) {
                temp.sender_id = inner_element1._id
                temp.sender_name = inner_element1.username
                temp.sender_image = inner_element1.image
              }
            });
            receiver.forEach(inner_element2 => {
              if (receiver_ids[index] == inner_element2._id) {
                temp.receiver_id = inner_element2._id
                temp.receiver_name = inner_element2.username
                temp.receiver_image = inner_element2.image
              }
            });
            product.forEach(inner_element3 => {
              if (product_ids[index] == inner_element3._id) {
                temp.product_id = inner_element3._id
                temp.seller_id = inner_element3.user_id
                temp.product_name = inner_element3.product_name
                temp.product_image = inner_element3.cover_thumb
              }
            });

            result.push(temp)
          });

          res.json({ success: true, data: { result, "productUrl": config.__image_url, "profileUrl": config.__profile_image_url } });
        })
      })
    })

  })
}
exports.add_product = function (req, res) {
  var image = [];
  req.files.forEach(function (val, index) {
    image.push(req.files[index].filename);
  })
  req.body.image = image;
  req.body.user_id = req.decoded._id;
  req.body.country = req.decoded.country;//add country according to token

  var new_product = new Product(req.body);
  new_product.save(function (err, product) {
    if (err)
      res.json({ success: false, message: err });
    res.json({ success: true, data: product, message: 'Product successfully created' });
  });
};

exports.deleteProduct = function (req, res) {
  var product_id = req.params.product_id;
  if (!product_id) {
    res.json({ success: false, message: "Product_id not found" });
  }
  Product.find({ _id: product_id }, function (err, prod) {
    if (!err) {
      Product.remove({ _id: product_id }, function (err, product) {
        if (err)
          res.json({ success: false, error: err });
        var images = prod[0].image;
        images.forEach(function (item, i) {
          S3Helper.removeObj(config.AWS_S3_BUCKET, item)
          /*  var path = '././uploads/productImages/' + item;
          require("fs").unlink(path, (err) => {
             if (!err) {
               console.log("Data deleted successfully", path);
             } else {
               console.log("Data deleted failed ", path);
             }
           })*/
        });
        res.json({ success: true, message: 'Product successfully deleted' });
      })
    }
  })

};

exports.get_all = function (req, res) {
  var country = req.decoded ? req.decoded.country : null;
  if (country && country[0] != null) {
    Product.find({ country: { $in: country } }, function (err, product) {
      if (err)
        res.json({ success: false, error: err });
      res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
    });
  } else {
    Product.find(function (err, product) {
      if (err)
        res.json({ success: false, error: err });
      res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
    });
  }
};

exports.get_all_new = function (req, res) {
  var country = req.decoded ? req.decoded.country : null;
  if (country && country[0] != null) {
    Product.find({ country: { $in: country } }, function (err, product) {
      if (err)
        res.json({ success: false, error: err });
      res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
    }).populate("user_id");
  } else {
    Product.find(function (err, product) {
      if (err)
        res.json({ success: false, error: err });
      res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
    }).populate("user_id");
  }
};

exports.productByCategory = function (req, res) {
  var category = req.body.category;
  console.log("body", req.body)
  Product.find({ category: category }, function (err, user) {
    if (err)
      res.json({ success: false, error: err });
    res.json({ success: true, data: user });
  });
};

exports.nearBy = function (req, res) {
  Product.aggregate([{
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [-122, 37.10]
      },
      distanceField: "dist.calculated",
      maxDistance: 80102,
      spherical: true
    }
  }]).then(function (product) {
    res.send(product);

  }).catch();

};

exports.search_product = function (req, res) {
  var svalue = req.body.search_value;
  if (!svalue) {
    res.json({ success: false, message: 'search value required' });
  }
  const userRegex = new RegExp(svalue, 'i');

  var country = req.decoded ? req.decoded.country : null;

  if (country && country[0] != null) {
    Product.find({
      $and:
        [
          { country: { $in: country } },
          { product_name: userRegex }
        ]
    }, function (err, user) {
      if (err)
        res.json({ success: false, error: err });

      res.json({ success: true, data: user });
    });
  } else {
    Product.find({ product_name: userRegex }
      , function (err, user) {
        if (err)
          res.json({ success: false, error: err });

        res.json({ success: true, data: user });
      });
  }


};

exports.updateProduct = function (req, res) {
  var _id = req.body._id;
  if (!_id) {
    res.json({ success: false, message: "Product id not found" });
  }
  Product.findOneAndUpdate({ _id: _id }, req.body, { new: true }, function (err, product) {
    if (err)
      res.json({ success: false, error: err });
    else
      res.json({ success: true, message: 'Product updated successfully', data: product });
  });
};

exports.count = function (req, res) {
  Product.count(function (err, cnt) {
    if (err)
      res.json({ success: false, error: err });
    res.json({ success: true, data: { name: 'Product', path: 'product', count: cnt } });
  });
};

//normal user
exports.product_listing = function (req, res) {
  const page = req.query.page ? parseInt(req.query.page) : 1
  const limit = req.query.limit ? parseInt(req.query.limit) : 10
  const startIndex = (page - 1) * limit
  let curr_date = new Date().getTime();
  let minus = 3 * 30 * 24 * 60 * 60 * 1000; //3 month
  let date = new Date(curr_date - minus);
  var latitude = req.body.latitude ? parseFloat(req.body.latitude) : 22.5738752;
  var longitude = req.body.longitude ? parseFloat(req.body.longitude) : 88.375296;

  var search_key = new RegExp(req.body.search_key ? req.body.search_key : ".*", 'i')
  var category = new RegExp(req.body.category ? req.body.category : ".*", 'i')
  var distance = req.body.distance ? req.body.distance : 804672; //500 miles default
  var unit = req.body.unit ? req.body.unit : 'Miles';
  // if (unit == 'Km' || unit == 'km')  //default is 500 mile = 804672 meter
  //   distance = distance ? distance * 1000 : 804672
  // else
  //   distance = distance ? distance * 1609 : 804672
  console.log(req.body, "", distance)
  Product.aggregate([{
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [longitude, latitude]
      },
      distanceField: "dist",
      maxDistance: distance,
      spherical: true
    }
  }, {
    $match: {
      $and: [
        { isBlock: false },
        { soldOut: false },
        {
          "createdAt": { $gt: date }
        },
        { category: category }
      ],
      $or: [
        { product_name: search_key },
        { product_description: search_key }
      ]
    }
  }, {
    $sort: {
      boosted_upto: -1, //Sort by Date Added DESC
      createdAt: -1
    }
  },
  {
    $facet: {
      "stage1": [{ "$group": { _id: null, count: { $sum: 1 } } }],
      "stage2": [{ $skip: startIndex },
      { $limit: limit }]

    }
  },

  { $unwind: "$stage1" },

  //output projection
  {
    $project: {
      product: "$stage2",
      total: "$stage1.count"

    }
  }], function (err, product) {
    if (err)
      res.json({ success: false, error: err });
    else {
      if (product.length > 0)
        res.json({ success: true, data: { product: product[0].product, total: product[0].total } });
      else
        res.json({ success: true, data: { product: [], total: 0 } });
    }

  });
}
//login user
exports.login_user_listing = function (req, res) {
  const page = req.query.page ? parseInt(req.query.page) : 1
  const limit = req.query.limit ? parseInt(req.query.limit) : 10
  const startIndex = (page - 1) * limit
  let curr_date = new Date().getTime();
  let minus = 3 * 30 * 24 * 60 * 60 * 1000; //3 month
  let date = new Date(curr_date - minus);
  var latitude = req.body.latitude ? parseFloat(req.body.latitude) : 22.5738752;
  var longitude = req.body.longitude ? parseFloat(req.body.longitude) : 88.375296;
  var distance = req.body.distance ? req.body.distance : 804672; //500 miles default
  var search_key = new RegExp(req.body.search_key ? req.body.search_key : ".*", 'i')
  var category = new RegExp(req.body.category ? req.body.category : ".*", 'i')
  console.log(req.body, "", distance)
  User.findOne({ _id: req.decoded._id }, function (err, docs) {
    if (err)
      res.json({ success: false, error: err });
    let block_user = []
    if (docs && docs.block_user_id)
      docs.block_user_id.forEach((element, index) => {
        block_user[index++] = new ObjectID(element);
      });
    Product.aggregate([{
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        distanceField: "dist",
        maxDistance: distance,
        spherical: true
      }
    }, {
      $match: {
        $and: [
          { isBlock: false },
          { soldOut: false },
          {
            "createdAt": { $gt: date }
          },
          {
            user_id: { $nin: block_user }
          },
          { category: category }
        ],
        $or: [
          { product_name: search_key },
          { product_description: search_key }
        ]
      }
    }, {
      $sort: {
        boosted_upto: -1, //Sort by Date Added DESC
        createdAt: -1
      }
    },
    {
      $facet: {
        "stage1": [{ "$group": { _id: null, count: { $sum: 1 } } }],
        "stage2": [{ $skip: startIndex },
        { $limit: limit }]

      }
    },

    { $unwind: "$stage1" },

    //output projection
    {
      $project: {
        product: "$stage2",
        total: "$stage1.count"

      }
    }], function (err, product) {
      if (err)
        res.json({ success: false, error: err });
      else {
        if (product.length > 0)
          res.json({ success: true, data: { product: product[0].product, total: product[0].total } });
        else
          res.json({ success: true, data: { product: [], total: 0 } });
      }
    });
  })

}
exports.search_user_product = function (req, res) {
  console.log(req.body, "", distance)
  let curr_date = new Date().getTime();
  let minus = 3 * 30 * 24 * 60 * 60 * 1000; //3 month
  let date = new Date(curr_date - minus);
  var svalue = req.body.search_value;
  var country = req.body.country ? req.body.country : null;
  var latitude = req.body.latitude ? parseFloat(req.body.latitude) : 11;
  var longitude = req.body.longitude ? parseFloat(req.body.longitude) : 11;
  var distance = req.body.distance ? req.body.distance : 10000000000;
  if (!svalue) {
    res.json({ success: false, message: 'search value required' });
  }
  const userRegex = new RegExp(svalue, 'i');
  Product.aggregate([{
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [longitude, latitude]
      },
      distanceField: "dist",
      maxDistance: distance,
      spherical: true
    }
  }, {
    $match: {
      $and: [
        { country: country },
        { product_name: userRegex },
        { isBlock: false },
        { soldOut: false },
        {
          "createdAt": { $gt: date }
        }
      ]
    }
  }], function (err, product) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
  });
};
exports.product_by_user_Category = function (req, res) {
  let curr_date = new Date().getTime();
  let minus = 3 * 30 * 24 * 60 * 60 * 1000; //3 month
  let date = new Date(curr_date - minus);
  var category = req.body.category;
  var country = req.body.country ? req.body.country : 'India';
  Product.find({
    $and: [
      { category: category },
      { country: country },
      { soldOut: false },
      {
        "createdAt": { $gt: date }
      }
    ]
  }, function (err, product) {
    if (err)
      res.json({ success: false, error: err });
    res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
  });
};
//seller
exports.my_product = function (req, res) {
  const page = req.query.page ? parseInt(req.query.page) : 1
  const limit = req.query.limit ? parseInt(req.query.limit) : 10
  const startIndex = (page - 1) * limit
  var user_id = req.decoded._id;
  let curr_date = new Date().getTime();
  let minus = 3 * 30 * 24 * 60 * 60 * 1000; //3 month
  let date = new Date(curr_date - minus);
  Product.aggregate([
    {
      $match:
      {
        $and: [
          { user_id: new ObjectID(user_id) },
          { soldOut: false },
          {
            "createdAt": { $gt: date }
          }
        ]
      }
    }, {
      $sort: { createdAt: -1 }
    },
    { $skip: startIndex },
    { $limit: limit }
  ], function (err, product) {
    if (err)
      res.json({ success: false, error: err });

    res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
  });
};
exports.soldout_list = function (req, res) {
  var user_id = req.decoded._id;
  Product.find({
    $and: [
      { user_id: new ObjectID(user_id) },
      { soldOut: true }
    ]
  }, function (err, product) {
    if (err)
      res.json({ success: false, error: err });
    Freebies.find({
      $and: [
        { user_id: new ObjectID(user_id) },
        { soldOut: true }
      ]
    }, function (err, freebies) {
      if (err)
        res.json({ success: false, error: err });
      res.json({ success: true, data: { product, freebies, "productImageUrl": config.__image_url } });
    });
    // res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
  });
};
exports.soldout = function (req, res) {
  var _id = req.body.product_id;
  var sold_id = req.body.sold_id ? req.body.sold_id : null;
  if (!_id) {
    res.json({ success: false, message: "Product id not found" });
  }
  Product.findOneAndUpdate({ _id: _id }, { soldOut: true, sold_id: sold_id }, { new: true }, function (err, product) {
    if (err)
      res.json({ success: false, error: err });
    else {
      if (!product) {
        Freebies.findOneAndUpdate({ _id: _id }, { soldOut: true, sold_id: sold_id }, { new: true }, function (err, freebies) {
          if (err)
            res.json({ success: false, error: err });
          else {
            if (freebies.likelist)
              freebies.likelist.forEach(inner_element => {
                User.findById(inner_element, function (err, user) {
                  if (err) {
                    console.log({ success: false, message: "User not found" });
                  }
                  if (user && user.notification.push.soldOut_favorited_product)
                    pushNotification(inner_element, "Hey ", `Your favorite product ${freebies.product_name} is sold out `, "soldout", "", freebies._id);
                  if (user && user.notification.email.soldOut_favorited_product)
                    mail_notification(inner_element, `Your favorite product ${freebies.product_name} is sold out .`, "soldout", "", freebies._id, "Sold Out");
                })

              });
            res.json({ success: true, message: 'Product updated successfully', data: freebies });
          }
        })
      } else {
        if (product.likelist)
          product.likelist.forEach(inner_element => {
            User.findById(inner_element, function (err, user) {
              if (err) {
                console.log({ success: false, message: "User not found" });
              }
              if (user && user.notification.push.soldOut_favorited_product)
                pushNotification(inner_element, "Hey ", `Your favorite product ${product.product_name} is sold out `, "soldout", "", product._id);
              if (user && user.notification.email.soldOut_favorited_product)
                mail_notification(inner_element, `Your favorite product ${product.product_name} is sold out .`, "soldout", "", product._id, "Sold Out");
            })

          });
        res.json({ success: true, message: 'Product updated successfully', data: product });
      }

    }
  });
};
exports.resell = function (req, res) {
  var _id = req.body.product_id;
  if (!_id) {
    res.json({ success: false, message: "Product id not found" });
  }
  Product.findOneAndUpdate({ _id: _id }, { soldOut: false }, { new: true }, function (err, product) {
    if (err)
      res.json({ success: false, error: err });
    else
      res.json({ success: true, message: 'Product updated successfully', data: product });
  });
};
//single image upload
exports.upload = function (req, res) {
  if (req.files) {
    var media = req.files.file;
    var mimetype = media.mimetype.split('/');
    var mediatype = mimetype[0];
    var ext = media.name.slice(media.name.lastIndexOf('.'));
    var ver = parseInt(Math.random() * 100);
    var fileName = 'product_' + Date.now() + ver + ext;

    var filePath = './uploads/productImages/' + fileName;
    //upload 
    media.mv(filePath, function (err) {
      if (!err) {
        res.json({ success: true, message: "Success", data: { image: fileName, path: config.__image_url } });
      } else {
        res.json({ success: false, message: "Upload Failed", err: err });
      }
    });
  } else {
    res.json({ success: false, message: "Document Not Found" });
  }
};
exports.upload_test = function (req, res) {
  if (req.files) {
    var IMAGE_FILES = req.files,
      modified_image = [];
    for (var key of Object.keys(IMAGE_FILES)) {
      var media = IMAGE_FILES[key];
      var mimetype = media.mimetype.split('/');
      var mediatype = mimetype[0];
      var ext = media.name.slice(media.name.lastIndexOf('.'));
      var ver = parseInt(Math.random() * 10000);
      var fileName = 'product' + ver + ext;

      var filePath = './uploads/productImages/' + fileName;
      modified_image.push(fileName);
      //upload 
      media.mv(filePath, function (err) {
        if (!err) {
          console.log({ success: true, message: "Success", data: { image: fileName, path: config.__image_url } });
        } else {
          console.log({ success: false, message: "Upload Failed", err: err });
        }
      });

    }
    res.send({ success: true, message: "Success", data: { image: modified_image, path: config.__image_url } });
  } else {
    res.json({ success: false, message: "Document Not Found" });
  }

};
//single image delete from server
exports.delete = function (req, res) {
  var image_name = req.body.file ? req.body.file : null;
  if (image_name == null) {
    res.json({ success: false, message: "Image file not found " });
  }
  S3Helper.removeObj(config.AWS_S3_BUCKET, image_name)
  let product_id = req.body.product_id;
  Product.findOneAndUpdate({ _id: product_id }, { $pull: { image: image_name } }, function (err, data) {
    if (err)
      res.json({ success: false, error: err });
    res.json({ success: true, message: "Data deleted successfully" });
  })
};




exports.discard = function (req, res) {
  var image_name = req.body.file ? req.body.file : null;
  if (image_name == null)
    res.json({ success: false, message: "Image file not found " });
  image_name.forEach(element => {

    S3Helper.removeObj(config.AWS_S3_BUCKET, element)
    // var path = './uploads/productImages/' + element;
    // require("fs").unlink(path, (err) => {
    //   if (!err) {
    //     console.log("delete " + element);
    //   } else {
    //     res.json({ success: false, message: "Data deleted failed ", err: err });
    //   }
    // })
  });
  res.json({ success: true, message: "Discard product " });
}
exports.add_seller_product = function (req, res) {
  if (req.body.unit && req.body.unit == "km" || req.body.unit == "Km")
    req.body.distance *= 0.621371;
  //adding subcategory
  if (req.body.category == 'Car' || req.body.category == 'car') {

    if (req.body.unit && req.body.unit == "km" || req.body.unit == "Km")
      req.body.range *= 0.621371;
    const sub_category_number = [{
      key: 'year',
      value: req.body.year ? req.body.year : 0
    }, {
      key: 'range',
      value: req.body.range ? req.body.range : 0
    }
    ];
    const sub_category = [{
      key: 'make',
      value: req.body.make ? req.body.make : ""
    }, {
      key: 'model',
      value: req.body.model ? req.body.model : ""
    }, {
      key: 'seller',
      value: req.body.seller ? req.body.seller : ""
    }, {
      key: 'transmission',
      value: req.body.transmission ? req.body.transmission : ""
    }, {
      key: 'trim',
      value: req.body.trim ? req.body.trim : ""
    }, {
      key: 'unit',
      value: req.body.unit ? req.body.unit : "miles"
    }];
    req.body.sub_category = sub_category;
    req.body.sub_category_number = sub_category_number;
  } else if (req.body.category == 'Housing' || req.body.category == 'housing') {
    const sub_category_number = [{
      key: 'bedRoomNo',
      value: req.body.bedRoomNo ? req.body.bedRoomNo : 0
    }, {
      key: 'bathRoomNo',
      value: req.body.bathRoomNo ? req.body.bathRoomNo : 0
    }
    ];
    const sub_category = [{
      key: 'typeList',
      value: req.body.typeList ? req.body.typeList : ""
    }, {
      key: 'propertyType',
      value: req.body.propertyType ? req.body.propertyType : ""
    }];
    req.body.sub_category = sub_category;
    req.body.sub_category_number = sub_category_number;
  } else if (req.body.category == 'Jobs' || req.body.category == 'Services') {
    const sub_category = [{
      key: 'type_of_job',
      value: req.body.type_of_job ? req.body.type_of_job : "Others"
    }]
    req.body.sub_category = sub_category;
  }
  req.body.user_id = req.decoded._id;

  if (!req.body.country)
    req.body.country = req.decoded.country;//add country according to token

  var new_product = new Product(req.body);
  new_product.save(function (err, product) {
    if (err)
      res.json({ success: false, message: err });
    //
    res.json({ success: true, data: product, message: 'Product successfully created' });
  });
};
exports.update_seller_product = function (req, res) {
  var _id = req.body._id ? req.body._id : req.params.product_id;
  if (req.body.unit && req.body.unit == "km" || req.body.unit == "Km")
    req.body.distance *= 0.621371;
  if (!_id) {
    res.json({ success: false, message: "Product id not found" });
  }
  if (req.body.category == 'Car' || req.body.category == 'car') {
    if (req.body.unit && req.body.unit == "km" || req.body.unit == "Km")
      req.body.range *= 0.621371;
    const sub_category_number = [{
      key: 'year',
      value: req.body.year ? req.body.year : 0
    }, {
      key: 'range',
      value: req.body.range ? req.body.range : 0
    }
    ];
    const sub_category = [{
      key: 'make',
      value: req.body.make ? req.body.make : ""
    }, {
      key: 'model',
      value: req.body.model ? req.body.model : ""
    }, {
      key: 'seller',
      value: req.body.seller ? req.body.seller : ""
    }, {
      key: 'transmission',
      value: req.body.transmission ? req.body.transmission : ""
    }, {
      key: 'trim',
      value: req.body.trim ? req.body.trim : ""
    }, {
      key: 'unit',
      value: req.body.unit ? req.body.unit : "miles"
    }];
    req.body.sub_category = sub_category;
    req.body.sub_category_number = sub_category_number;

  } else if (req.body.category == 'Housing' || req.body.category == 'housing') {
    const sub_category_number = [{
      key: 'bedRoomNo',
      value: req.body.bedRoomNo ? req.body.bedRoomNo : 0
    }, {
      key: 'bathRoomNo',
      value: req.body.bathRoomNo ? req.body.bathRoomNo : 0
    }
    ];
    const sub_category = [{
      key: 'typeList',
      value: req.body.typeList ? req.body.typeList : ""
    }, {
      key: 'propertyType',
      value: req.body.propertyType ? req.body.propertyType : ""
    }];
    req.body.sub_category = sub_category;
    req.body.sub_category_number = sub_category_number;
  } else if (req.body.category == 'Jobs' || req.body.category == 'Services') {
    const sub_category = [{
      key: 'type_of_job',
      value: req.body.type_of_job ? req.body.type_of_job : "Others"
    }];
    req.body.sub_category = sub_category;
  }

  Product.findOne({ _id: _id }, function (err, old_product) {

    if (!(old_product.product_price == req.body.product_price)) {
      old_product.likelist.forEach(inner_element => {
        User.findById(inner_element, function (err, user) {
          if (err) {
            console.log({ success: false, message: "User not found" });
          }
          if (user.notification.push.price_change_favorited_product)
            pushNotification(inner_element, "Hey ", `Your favorite product ${old_product.product_name} price changed `, "product_update", "", old_product._id)
          if (user.notification.email.price_change_favorited_product)
            mail_notification(inner_element, `Your favorite product ${old_product.product_name} price changed .`, "product_update", "", old_product._id, "Price Changed")
        })

      });
    }
    if (!(old_product.product_description == req.body.product_description)) {
      old_product.likelist.forEach(inner_element => {
        User.findById(inner_element, function (err, user) {
          if (err) {
            console.log({ success: false, message: "User not found" });
          }
          if (user.notification.push.description_change_favorited_product)
            pushNotification(inner_element, "Hey ", `Your favorite product ${old_product.product_name} description changed `, "product_update", "", old_product._id);
          if (user.notification.email.description_change_favorited_product)
            mail_notification(inner_element, `Your favorite product ${old_product.product_name} description changed .`, "product_update", "", old_product._id, "Description Changed")
        })

      });
    }
    if (!(JSON.stringify(old_product.image) == JSON.stringify(req.body.image))) {
      old_product.likelist.forEach(inner_element => {
        User.findById(inner_element, function (err, user) {
          if (err) {
            console.log({ success: false, message: "User not found" });
          }
          if (user.notification.push.image_change_favorited_product)
            pushNotification(inner_element, "Hey ", `Your favorite product ${old_product.product_name} image changed `, "product_update", "", old_product._id);
          if (user.notification.email.image_change_favorited_product)
            mail_notification(inner_element, `Your favorite product ${old_product.product_name} image changed .`, "product_update", "", old_product._id, "Media Changed");
        })

      });
    }
    Product.findOneAndUpdate({ _id: _id }, req.body, { new: true }, function (err, product) {
      if (err) {
        res.json({ success: false, error: err });
      }
      else
        res.json({ success: true, message: 'Product updated successfully', data: product });
    })

  })

};
exports.delete_seller_product = function (req, res) {
  var product_id = req.params.product_id ? req.params.product_id : req.body.product_id;
  var user_id = req.decoded._id;
  if (!product_id) {
    res.json({ success: false, message: "Product_id not found" });
  }
  Product.find({ $and: [{ _id: product_id }, { user_id: user_id }] }, function (err, prod) {
    if (!err) {
      if (prod.length == 0) {
        res.json({ success: false, message: "You can't delete this product" });
      }
      prod[0].likelist.forEach(inner_element => {
        User.findById(inner_element, function (err, user) {
          if (err) {
            console.log({ success: false, message: "User not found" });
          }
          if (user.notification.push.delete_favorite_product)
            pushNotification(inner_element, "Hey ", `Your favorite product ${prod[0].product_name} is deleted `, "product_delete", "", prod[0]._id);
          if (user.notification.email.delete_favorite_product)
            mail_notification(inner_element, `Your favorite product ${prod[0].product_name} is deleted .`, "product_delete", "", prod[0]._id, "Delete");
        })
      });
      Product.remove({ _id: product_id }, function (err, product) {
        if (err)
          res.json({ success: false, error: err });
        var images = prod[0].image;
        images.forEach(function (item, i) {

          S3Helper.removeObj(config.AWS_S3_BUCKET, item)
          // var path = '././uploads/productImages/' + item;
          // require("fs").unlink(path, (err) => {
          //   if (!err) {
          //     console.log("Data deleted successfully", path);
          //   } else {
          //     console.log("Data deleted failed ", path);
          //   }
          // })
        });
        res.json({ success: true, message: 'Product successfully deleted' });
      })
    }
  })

};
exports.reactivation_product = function (req, res) {
  var _id = req.body.product_id;
  if (!_id) {
    res.json({ success: false, message: "Product id not found" });
  }
  Product.updateOne({ _id: _id }, { $set: { createdAt: new Date() } }, function (err, product) {
    if (err)
      res.json({ success: false, error: err });
    else
      res.json({ success: true, message: 'Product reactivated successfully', data: product });
  });
}

exports.boost_product = (req, res) => {
  var product_id = req.body.product_id;
  let curr_date = Math.floor(Date.now() / 1000);
  let no_of_days = req.body.no_of_day;
  if (!no_of_days)
    res.json({ success: false, message: "failed please contact admin" });
  let boosted_day = no_of_days * 24 * 60 * 60; //3 month
  let date = curr_date + boosted_day;
  if (!product_id) {
    res.json({ success: false, message: "Product_id not found" });
  } else {
    Product.findOneAndUpdate({ _id: product_id }, { boosted_at: curr_date, boosted_upto: date, boost: 1 }, { new: true }, function (err, product) {
      if (err)
        res.json({ success: false, error: err });
      else
        res.json({ success: true, message: 'Product boosted', data: product });
    });
  }
}
exports.product_filter = function (req, res) {
  console.log(req.body)
  const page = req.query.page ? parseInt(req.query.page) : 1
  const limit = req.query.limit ? parseInt(req.query.limit) : 10
  const startIndex = (page - 1) * limit
  const _id = req.decoded ? req.decoded._id : null
  if (Array.isArray(req.body.category)) {// for web multiple category filter
    multiple_filter(_id, req.body, page, limit).then((product) => res.json({ success: true, data: { product: product.product, total: product.count } }))
      .catch(err => res.json({ success: false, message: err }))
  } else {
    var category = req.body.category ? req.body.category : 'null';
    if (category == 'Jobs' || category == 'Services') {
      job_service_filter(_id, req.body, page, limit).then((product) => res.json({ success: true, data: { product: product.product, total: product.count } }))
        .catch(err => res.json({ success: false, message: err }))
    } else if (category == 'Car' || category == 'car') {
      car_service_filter(_id, req.body, page, limit).then((product) => res.json({ success: true, data: { product: product.product, total: product.count } }))
        .catch(err => res.json({ success: false, message: err }))
    } else if (category == 'housing' || category == 'Housing') {
      house_service_filter(_id, req.body, page, limit).then((product) => res.json({ success: true, data: { product: product.product, total: product.count } }))
        .catch(err => res.json({ success: false, message: err }))
    } else if (category == 'All categories') {
      job_service_filter(_id, req.body, page, limit).then((product) => res.json({ success: true, data: { product: product.product, total: product.count } }))
        .catch(err => res.json({ success: false, message: err }))
    } else {
      job_service_filter(_id, req.body, page, limit).then((product) => res.json({ success: true, data: { product: product.product, total: product.count } }))
        .catch(err => res.json({ success: false, message: err }))
    }
  }
}

exports.product_filter_development = function (req, res) {
  const page = req.query.page ? parseInt(req.query.page) : 1
  const limit = req.query.limit ? parseInt(req.query.limit) : 10
  const startIndex = (page - 1) * limit
  const _id = req.decoded ? req.decoded._id : null
  if (Array.isArray(req.body.category)) {// for web multiple category filter
    multiple_filter(_id, req.body, page, limit).then((product) => res.json({ success: true, data: { product: product.product, total: product.count } }))
      .catch(err => res.json({ success: false, message: err }))
  } else {
    var category = req.body.category ? req.body.category : 'null';
    if (category == 'Jobs' || category == 'Services') {
      job_service_filter(_id, req.body, page, limit).then((product) => res.json({ success: true, data: { product: product.product, total: product.count } }))
        .catch(err => res.json({ success: false, message: err }))
    } else {
      let no_of_day = 90;
      let min_price = req.body.price[0].lower ? parseFloat(req.body.price[0].lower) : 0;
      let max_price = req.body.price[0].upper ? parseFloat(req.body.price[0].upper) : 100000000;
      let curr_date = new Date().getTime();
      let minus = no_of_day * 24 * 60 * 60 * 1000; //3 month
      let date = new Date(curr_date - minus);
      var latitude = req.body.latitude ? parseFloat(req.body.latitude) : 11;
      var longitude = req.body.longitude ? parseFloat(req.body.longitude) : 21.1;
      var country = req.body.country;
      var distance = req.body.distance;
      var sortBy = req.body.sortBy ? req.body.sortBy : 'PublishRecent';
      var unit = req.body.unit ? req.body.unit : 'Miles';

      var make = new RegExp(req.body.make ? req.body.make : ".*", 'i'),
        model = new RegExp(req.body.model ? req.body.model : ".*", 'i'),
        seller = new RegExp(req.body.seller ? req.body.seller : ".*", 'i'),
        transmission = new RegExp(req.body.transmission ? req.body.transmission : ".*", 'i'),
        trim = new RegExp(req.body.trim ? req.body.trim : ".*", 'i'),
        typeList = new RegExp(req.body.typeList ? req.body.typeList : ".*", 'i'),
        propertyType = new RegExp(req.body.propertyType ? req.body.propertyType : ".*", 'i'),
        range = req.body.range ? req.body.range : 99999999999,
        bedRoomNo = req.body.bedRoomNo ? req.body.bedRoomNo : 1,
        bathRoomNo = req.body.bathRoomNo ? req.body.bathRoomNo : 1;



      if (!country)
        res.json({ success: false, message: "Empty Country" });

      distance = distance ? distance : 804672
      let block_user = []
      let _id = req.decoded_id ? req.decoded_id : null
      User.findOne({ _id: _id }, function (err, docs) {
        if (err)
          res.json({ success: false, error: err });
        if (docs)
          docs.block_user_id.forEach((element, index) => {
            block_user[index++] = new ObjectID(element);
          });

        switch (sortBy) {
          case "Distance":
            if (category == 'car' || category == 'Car') {
              let min_year = req.body.year ? parseInt(req.body.year.lower) : 1900,
                max_year = req.body.year ? parseInt(req.body.year.upper) : 2050;
              if (unit == 'Km' || unit == 'km') {
                range *= 0.621371;
              }

              Product.aggregate([{
                $geoNear: {
                  near: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                  },
                  distanceField: "dist",
                  maxDistance: distance,
                  spherical: true
                }
              }, {
                $match: {
                  $and: [{ category: category },
                  { country: country },
                  { isBlock: false },
                  { soldOut: false },
                  { "createdAt": { $gt: date } },
                  { sub_category: { $elemMatch: { key: "make", value: make } } },
                  { sub_category: { $elemMatch: { key: "model", value: model } } },
                  { sub_category_number: { $elemMatch: { key: "year", value: { $lte: max_year } } } },
                  { sub_category_number: { $elemMatch: { key: "year", value: { $gte: min_year } } } },
                  { sub_category_number: { $elemMatch: { key: "range", value: { $lte: range } } } },
                  { sub_category: { $elemMatch: { key: "seller", value: seller } } },
                  { sub_category: { $elemMatch: { key: "transmission", value: transmission } } },
                  { sub_category: { $elemMatch: { key: "trim", value: trim } } },

                  { "product_price": { $gte: min_price } },
                  { "product_price": { $lte: max_price } },
                  {
                    user_id: { $nin: block_user }
                  }
                  ]
                }
              }, {
                $sort: {
                  dist: -1,
                  boosted_upto: -1//Sort by Date Added DESC

                }
              },
              {
                $facet: {
                  "stage1": [{ "$group": { _id: null, count: { $sum: 1 } } }],
                  "stage2": [{ $skip: startIndex },
                  { $limit: limit }]

                }
              },

              { $unwind: "$stage1" },

              //output projection
              {
                $project: {
                  product: "$stage2",
                  total: "$stage1.count"

                }
              }], function (err, product) {
                if (err)
                  res.json({ success: false, error: err });
                else {
                  if (product.length > 0)
                    res.json({ success: true, data: { product: product[0].product, total: product[0].total } });
                  else
                    res.json({ success: true, data: { product: [], total: 0 } });
                }
              });
            } else if (category == 'housing' || category == 'Housing') {
              Product.aggregate([{
                $geoNear: {
                  near: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                  },
                  distanceField: "dist",
                  maxDistance: distance,
                  spherical: true
                }
              }, {
                $match: {
                  $and: [{ category: category },
                  { country: country },
                  { isBlock: false },
                  { soldOut: false },
                  { "createdAt": { $gt: date } },
                  { sub_category: { $elemMatch: { key: "typeList", value: typeList } } },
                  { sub_category: { $elemMatch: { key: "propertyType", value: propertyType } } },
                  { sub_category_number: { $elemMatch: { key: "bedRoomNo", value: { $gte: parseFloat(bedRoomNo) } } } },
                  { sub_category_number: { $elemMatch: { key: "bathRoomNo", value: { $gte: parseFloat(bathRoomNo) } } } },

                  { "product_price": { $gte: min_price } },
                  { "product_price": { $lte: max_price } },
                  {
                    user_id: { $nin: block_user }
                  }
                  ]
                }
              }, {
                $sort: {
                  dist: -1,
                  boosted_upto: -1//Sort by Date Added DESC


                }
              },
              {
                $facet: {
                  "stage1": [{ "$group": { _id: null, count: { $sum: 1 } } }],
                  "stage2": [{ $skip: startIndex },
                  { $limit: limit }]

                }
              },

              { $unwind: "$stage1" },

              //output projection
              {
                $project: {
                  product: "$stage2",
                  total: "$stage1.count"

                }
              }], function (err, product) {
                if (err)
                  res.json({ success: false, error: err });
                else {
                  if (product.length > 0)
                    res.json({ success: true, data: { product: product[0].product, total: product[0].total } });
                  else
                    res.json({ success: true, data: { product: [], total: 0 } });
                }
              });
            } else if (category == 'All categories') {
              Product.aggregate([{
                $geoNear: {
                  near: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                  },
                  distanceField: "dist",
                  maxDistance: distance,
                  spherical: true
                }
              }, {
                $match: {
                  $and: [
                    { country: country },
                    { isBlock: false },
                    { soldOut: false },
                    { "createdAt": { $gt: date } },

                    { "product_price": { $gte: min_price } },
                    { "product_price": { $lte: max_price } },
                    {
                      user_id: { $nin: block_user }
                    }
                  ]
                }
              },
              {
                $sort: {
                  dist: -1,
                  boosted_upto: -1//Sort by Date Added DESC


                }
              },
              {
                $facet: {
                  "stage1": [{ "$group": { _id: null, count: { $sum: 1 } } }],
                  "stage2": [{ $skip: startIndex },
                  { $limit: limit }]

                }
              },

              { $unwind: "$stage1" },

              //output projection
              {
                $project: {
                  product: "$stage2",
                  total: "$stage1.count"

                }
              }], function (err, product) {
                if (err)
                  res.json({ success: false, error: err });

                else {
                  if (product.length > 0)
                    res.json({ success: true, data: { product: product[0].product, total: product[0].total } });
                  else
                    res.json({ success: true, data: { product: [], total: 0 } });
                }
              });
            } else {
              Product.aggregate([{
                $geoNear: {
                  near: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                  },
                  distanceField: "dist",
                  maxDistance: distance,
                  spherical: true
                }
              }, {
                $match: {
                  $and: [{ category: category },
                  { country: country },
                  { isBlock: false },
                  { soldOut: false },
                  { "createdAt": { $gt: date } },

                  { "product_price": { $gte: min_price } },
                  { "product_price": { $lte: max_price } },
                  {
                    user_id: { $nin: block_user }
                  }
                  ]
                }
              }, {
                $sort: {
                  dist: -1,
                  boosted_upto: -1//Sort by Date Added DESC


                }
              },
              {
                $facet: {
                  "stage1": [{ "$group": { _id: null, count: { $sum: 1 } } }],
                  "stage2": [{ $skip: startIndex },
                  { $limit: limit }]

                }
              },

              { $unwind: "$stage1" },

              //output projection
              {
                $project: {
                  product: "$stage2",
                  total: "$stage1.count"

                }
              }], function (err, product) {
                if (err)
                  res.json({ success: false, error: err });
                else {
                  if (product.length > 0)
                    res.json({ success: true, data: { product: product[0].product, total: product[0].total } });
                  else
                    res.json({ success: true, data: { product: [], total: 0 } });
                }
              });
            }

            break;
          case "PriceAsc":
            if (category == 'car' || category == 'Car') {
              let min_year = req.body.year ? parseInt(req.body.year.lower) : 1900,
                max_year = req.body.year ? parseInt(req.body.year.upper) : 2050;
              if (unit == 'Km' || unit == 'km') {
                range *= 0.621371;
              }

              Product.aggregate([{
                $geoNear: {
                  near: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                  },
                  distanceField: "dist",
                  maxDistance: distance,
                  spherical: true
                }
              }, {
                $match: {
                  $and: [{ category: category },
                  { country: country },
                  { isBlock: false },
                  { soldOut: false },
                  { "createdAt": { $gt: date } },
                  { sub_category: { $elemMatch: { key: "make", value: make } } },
                  { sub_category: { $elemMatch: { key: "model", value: model } } },
                  { sub_category_number: { $elemMatch: { key: "year", value: { $lte: max_year } } } },
                  { sub_category_number: { $elemMatch: { key: "year", value: { $gte: min_year } } } },
                  { sub_category_number: { $elemMatch: { key: "range", value: { $lte: range } } } },
                  { sub_category: { $elemMatch: { key: "seller", value: seller } } },
                  { sub_category: { $elemMatch: { key: "transmission", value: transmission } } },
                  { sub_category: { $elemMatch: { key: "trim", value: trim } } },

                  { "product_price": { $gte: min_price } },
                  { "product_price": { $lte: max_price } },
                  {
                    user_id: { $nin: block_user }
                  }
                  ]
                }
              }, {
                $sort: {
                  product_price: 1,
                  boosted_upto: -1//Sort by Date Added DESC


                }
              },
              {
                $facet: {
                  "stage1": [{ "$group": { _id: null, count: { $sum: 1 } } }],
                  "stage2": [{ $skip: startIndex },
                  { $limit: limit }]

                }
              },

              { $unwind: "$stage1" },

              //output projection
              {
                $project: {
                  product: "$stage2",
                  total: "$stage1.count"

                }
              }], function (err, product) {
                if (err)
                  res.json({ success: false, error: err });
                else {
                  if (product.length > 0)
                    res.json({ success: true, data: { product: product[0].product, total: product[0].total } });
                  else
                    res.json({ success: true, data: { product: [], total: 0 } });
                }
              });
            } else if (category == 'housing' || category == 'Housing') {
              Product.aggregate([{
                $geoNear: {
                  near: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                  },
                  distanceField: "dist",
                  maxDistance: distance,
                  spherical: true
                }
              }, {
                $match: {
                  $and: [{ category: category },
                  { country: country },
                  { isBlock: false },
                  { soldOut: false },
                  { "createdAt": { $gt: date } },
                  { sub_category: { $elemMatch: { key: "typeList", value: typeList } } },
                  { sub_category: { $elemMatch: { key: "propertyType", value: propertyType } } },
                  { sub_category_number: { $elemMatch: { key: "bedRoomNo", value: { $gte: parseFloat(bedRoomNo) } } } },
                  { sub_category_number: { $elemMatch: { key: "bathRoomNo", value: { $gte: parseFloat(bathRoomNo) } } } },

                  { "product_price": { $gte: min_price } },
                  { "product_price": { $lte: max_price } },
                  {
                    user_id: { $nin: block_user }
                  }
                  ]
                }
              }, {
                $sort: {
                  product_price: 1,
                  boosted_upto: -1//Sort by Date Added DESC

                }
              },
              {
                $facet: {
                  "stage1": [{ "$group": { _id: null, count: { $sum: 1 } } }],
                  "stage2": [{ $skip: startIndex },
                  { $limit: limit }]

                }
              },

              { $unwind: "$stage1" },

              //output projection
              {
                $project: {
                  product: "$stage2",
                  total: "$stage1.count"

                }
              }], function (err, product) {
                if (err)
                  res.json({ success: false, error: err });
                else {
                  if (product.length > 0)
                    res.json({ success: true, data: { product: product[0].product, total: product[0].total } });
                  else
                    res.json({ success: true, data: { product: [], total: 0 } });
                }
              });
            } else if (category == 'All categories') {
              Product.aggregate([{
                $geoNear: {
                  near: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                  },
                  distanceField: "dist",
                  maxDistance: distance,
                  spherical: true
                }
              }, {
                $match: {
                  $and: [
                    { country: country },
                    { isBlock: false },
                    { soldOut: false },
                    { "createdAt": { $gt: date } },

                    { "product_price": { $gte: min_price } },
                    { "product_price": { $lte: max_price } },
                    {
                      user_id: { $nin: block_user }
                    }
                  ]
                }
              },
              {
                $sort: {
                  product_price: 1,
                  boosted_upto: -1//Sort by Date Added DESC


                }
              },
              {
                $facet: {
                  "stage1": [{ "$group": { _id: null, count: { $sum: 1 } } }],
                  "stage2": [{ $skip: startIndex },
                  { $limit: limit }]

                }
              },

              { $unwind: "$stage1" },

              //output projection
              {
                $project: {
                  product: "$stage2",
                  total: "$stage1.count"

                }
              }], function (err, product) {
                if (err)
                  res.json({ success: false, error: err });

                else {
                  if (product.length > 0)
                    res.json({ success: true, data: { product: product[0].product, total: product[0].total } });
                  else
                    res.json({ success: true, data: { product: [], total: 0 } });
                }
              });
            } else {
              Product.aggregate([{
                $geoNear: {
                  near: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                  },
                  distanceField: "dist",
                  maxDistance: distance,
                  spherical: true
                }
              }, {
                $match: {
                  $and: [{ category: category },
                  { country: country },
                  { isBlock: false },
                  { soldOut: false },
                  { "createdAt": { $gt: date } },

                  { "product_price": { $gte: min_price } },
                  { "product_price": { $lte: max_price } },
                  {
                    user_id: { $nin: block_user }
                  }
                  ]
                }
              }, {
                $sort: {
                  product_price: 1,
                  boosted_upto: -1//Sort by Date Added DESC

                }
              },
              {
                $facet: {
                  "stage1": [{ "$group": { _id: null, count: { $sum: 1 } } }],
                  "stage2": [{ $skip: startIndex },
                  { $limit: limit }]

                }
              },

              { $unwind: "$stage1" },

              //output projection
              {
                $project: {
                  product: "$stage2",
                  total: "$stage1.count"

                }
              }], function (err, product) {
                if (err)
                  res.json({ success: false, error: err });
                else {
                  if (product.length > 0)
                    res.json({ success: true, data: { product: product[0].product, total: product[0].total } });
                  else
                    res.json({ success: true, data: { product: [], total: 0 } });
                }
              });
            }

            break;
          case "PriceDesc":
            if (category == 'car' || category == 'Car') {
              let min_year = req.body.year ? parseInt(req.body.year.lower) : 1900,
                max_year = req.body.year ? parseInt(req.body.year.upper) : 2050;
              if (unit == 'Km' || unit == 'km') {
                range *= 0.621371;
              }

              Product.aggregate([{
                $geoNear: {
                  near: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                  },
                  distanceField: "dist",
                  maxDistance: distance,
                  spherical: true
                }
              }, {
                $match: {
                  $and: [{ category: category },
                  { country: country },
                  { isBlock: false },
                  { soldOut: false },
                  { "createdAt": { $gt: date } },
                  { sub_category: { $elemMatch: { key: "make", value: make } } },
                  { sub_category: { $elemMatch: { key: "model", value: model } } },
                  { sub_category_number: { $elemMatch: { key: "year", value: { $lte: max_year } } } },
                  { sub_category_number: { $elemMatch: { key: "year", value: { $gte: min_year } } } },
                  { sub_category_number: { $elemMatch: { key: "range", value: { $lte: range } } } },
                  { sub_category: { $elemMatch: { key: "seller", value: seller } } },
                  { sub_category: { $elemMatch: { key: "transmission", value: transmission } } },
                  { sub_category: { $elemMatch: { key: "trim", value: trim } } },

                  { "product_price": { $gte: min_price } },
                  { "product_price": { $lte: max_price } },
                  {
                    user_id: { $nin: block_user }
                  }
                  ]
                }
              }, {
                $sort: {
                  product_price: -1,
                  boosted_upto: -1//Sort by Date Added DESC


                }
              },
              {
                $facet: {
                  "stage1": [{ "$group": { _id: null, count: { $sum: 1 } } }],
                  "stage2": [{ $skip: startIndex },
                  { $limit: limit }]

                }
              },

              { $unwind: "$stage1" },

              //output projection
              {
                $project: {
                  product: "$stage2",
                  total: "$stage1.count"

                }
              }], function (err, product) {
                if (err)
                  res.json({ success: false, error: err });
                else {
                  if (product.length > 0)
                    res.json({ success: true, data: { product: product[0].product, total: product[0].total } });
                  else
                    res.json({ success: true, data: { product: [], total: 0 } });
                }
              });
            } else if (category == 'housing' || category == 'Housing') {
              Product.aggregate([{
                $geoNear: {
                  near: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                  },
                  distanceField: "dist",
                  maxDistance: distance,
                  spherical: true
                }
              }, {
                $match: {
                  $and: [{ category: category },
                  { country: country },
                  { isBlock: false },
                  { soldOut: false },
                  { "createdAt": { $gt: date } },
                  { sub_category: { $elemMatch: { key: "typeList", value: typeList } } },
                  { sub_category: { $elemMatch: { key: "propertyType", value: propertyType } } },
                  { sub_category_number: { $elemMatch: { key: "bedRoomNo", value: { $gte: parseFloat(bedRoomNo) } } } },
                  { sub_category_number: { $elemMatch: { key: "bathRoomNo", value: { $gte: parseFloat(bathRoomNo) } } } },

                  { "product_price": { $gte: min_price } },
                  { "product_price": { $lte: max_price } },
                  {
                    user_id: { $nin: block_user }
                  }
                  ]
                }
              }, {
                $sort: {
                  product_price: -1,
                  boosted_upto: -1//Sort by Date Added DESC

                }
              },
              {
                $facet: {
                  "stage1": [{ "$group": { _id: null, count: { $sum: 1 } } }],
                  "stage2": [{ $skip: startIndex },
                  { $limit: limit }]

                }
              },

              { $unwind: "$stage1" },

              //output projection
              {
                $project: {
                  product: "$stage2",
                  total: "$stage1.count"

                }
              }], function (err, product) {
                if (err)
                  res.json({ success: false, error: err });
                else {
                  if (product.length > 0)
                    res.json({ success: true, data: { product: product[0].product, total: product[0].total } });
                  else
                    res.json({ success: true, data: { product: [], total: 0 } });
                }
              });
            } else if (category == 'All categories') {

              Product.aggregate([{
                $geoNear: {
                  near: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                  },
                  distanceField: "dist",
                  maxDistance: distance,
                  spherical: true
                }
              }, {
                $match: {
                  $and: [
                    { isBlock: false },
                    { soldOut: false },
                    { "createdAt": { $gt: date } },
                    { country: country },

                    { "product_price": { $gte: min_price } },
                    { "product_price": { $lte: max_price } },
                    {
                      user_id: { $nin: block_user }
                    }
                  ]
                }
              },
              {
                $sort: {
                  product_price: -1,
                  boosted_upto: -1//Sort by Date Added DESC
                }
              },
              {
                $facet: {
                  "stage1": [{ "$group": { _id: null, count: { $sum: 1 } } }],
                  "stage2": [{ $skip: startIndex },
                  { $limit: limit }]

                }
              },

              { $unwind: "$stage1" },

              //output projection
              {
                $project: {
                  product: "$stage2",
                  total: "$stage1.count"

                }
              }], function (err, product) {
                if (err)
                  res.json({ success: false, error: err });

                else {
                  if (product.length > 0)
                    res.json({ success: true, data: { product: product[0].product, total: product[0].total } });
                  else
                    res.json({ success: true, data: { product: [], total: 0 } });
                }
              });
            } else {
              Product.aggregate([{
                $geoNear: {
                  near: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                  },
                  distanceField: "dist",
                  maxDistance: distance,
                  spherical: true
                }
              }, {
                $match: {
                  $and: [{ category: category },
                  { country: country },
                  { isBlock: false },
                  { soldOut: false },
                  { "createdAt": { $gt: date } },

                  { "product_price": { $gte: min_price } },
                  { "product_price": { $lte: max_price } },
                  {
                    user_id: { $nin: block_user }
                  }
                  ]
                }
              }, {
                $sort: {
                  product_price: -1,
                  boosted_upto: -1//Sort by Date Added DESC

                }
              },
              {
                $facet: {
                  "stage1": [{ "$group": { _id: null, count: { $sum: 1 } } }],
                  "stage2": [{ $skip: startIndex },
                  { $limit: limit }]

                }
              },

              { $unwind: "$stage1" },

              //output projection
              {
                $project: {
                  product: "$stage2",
                  total: "$stage1.count"

                }
              }], function (err, product) {
                if (err)
                  res.json({ success: false, error: err });
                else {
                  if (product.length > 0)
                    res.json({ success: true, data: { product: product[0].product, total: product[0].total } });
                  else
                    res.json({ success: true, data: { product: [], total: 0 } });
                }
              });
            }

            break;
          case "PublishRecent":
            if (category == 'car' || category == 'Car') {
              let min_year = req.body.year ? parseInt(req.body.year.lower) : 1900,
                max_year = req.body.year ? parseInt(req.body.year.upper) : 2050;
              if (unit == 'Km' || unit == 'km') {
                range *= 0.621371;
              }

              Product.aggregate([{
                $geoNear: {
                  near: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                  },
                  distanceField: "dist",
                  maxDistance: distance,
                  spherical: true
                }
              }, {
                $match: {
                  $and: [{ category: category },
                  { country: country },
                  { isBlock: false },
                  { soldOut: false },
                  { "createdAt": { $gt: date } },
                  { sub_category: { $elemMatch: { key: "make", value: make } } },
                  { sub_category: { $elemMatch: { key: "model", value: model } } },
                  { sub_category_number: { $elemMatch: { key: "year", value: { $lte: max_year } } } },
                  { sub_category_number: { $elemMatch: { key: "year", value: { $gte: min_year } } } },
                  { sub_category_number: { $elemMatch: { key: "range", value: { $lte: range } } } },
                  { sub_category: { $elemMatch: { key: "seller", value: seller } } },
                  { sub_category: { $elemMatch: { key: "transmission", value: transmission } } },
                  { sub_category: { $elemMatch: { key: "trim", value: trim } } },

                  { "product_price": { $gte: min_price } },
                  { "product_price": { $lte: max_price } },
                  {
                    user_id: { $nin: block_user }
                  }
                  ]
                }
              }, {
                $sort: {
                  createdAt: -1,
                  boosted_upto: -1//Sort by Date Added DESC

                }
              },
              {
                $facet: {
                  "stage1": [{ "$group": { _id: null, count: { $sum: 1 } } }],
                  "stage2": [{ $skip: startIndex },
                  { $limit: limit }]

                }
              },

              { $unwind: "$stage1" },

              //output projection
              {
                $project: {
                  product: "$stage2",
                  total: "$stage1.count"

                }
              }], function (err, product) {
                if (err)
                  res.json({ success: false, error: err });
                else {
                  if (product.length > 0)
                    res.json({ success: true, data: { product: product[0].product, total: product[0].total } });
                  else
                    res.json({ success: true, data: { product: [], total: 0 } });
                }
              });
            } else if (category == 'housing' || category == 'Housing') {
              Product.aggregate([{
                $geoNear: {
                  near: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                  },
                  distanceField: "dist",
                  maxDistance: distance,
                  spherical: true
                }
              }, {
                $match: {
                  $and: [{ category: category },
                  { country: country },
                  { isBlock: false },
                  { soldOut: false },
                  { "createdAt": { $gt: date } },
                  { sub_category: { $elemMatch: { key: "typeList", value: typeList } } },
                  { sub_category: { $elemMatch: { key: "propertyType", value: propertyType } } },
                  { sub_category_number: { $elemMatch: { key: "bedRoomNo", value: { $gte: parseFloat(bedRoomNo) } } } },
                  { sub_category_number: { $elemMatch: { key: "bathRoomNo", value: { $gte: parseFloat(bathRoomNo) } } } },

                  { "product_price": { $gte: min_price } },
                  { "product_price": { $lte: max_price } },
                  {
                    user_id: { $nin: block_user }
                  }
                  ]
                }
              }, {
                $sort: {
                  createdAt: -1,
                  boosted_upto: -1//Sort by Date Added DESC

                }
              },
              {
                $facet: {
                  "stage1": [{ "$group": { _id: null, count: { $sum: 1 } } }],
                  "stage2": [{ $skip: startIndex },
                  { $limit: limit }]

                }
              },

              { $unwind: "$stage1" },

              //output projection
              {
                $project: {
                  product: "$stage2",
                  total: "$stage1.count"

                }
              }], function (err, product) {
                if (err)
                  res.json({ success: false, error: err });

                else {
                  if (product.length > 0)
                    res.json({ success: true, data: { product: product[0].product, total: product[0].total } });
                  else
                    res.json({ success: true, data: { product: [], total: 0 } });
                }
              });
            } else if (category == 'All categories') {
              Product.aggregate([{
                $geoNear: {
                  near: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                  },
                  distanceField: "dist",
                  maxDistance: distance,
                  spherical: true
                }
              }, {
                $match: {
                  $and: [
                    { country: country },
                    { isBlock: false },
                    { soldOut: false },
                    { "createdAt": { $gt: date } },
                    { "product_price": { $gte: min_price } },
                    { "product_price": { $lte: max_price } },
                    {
                      user_id: { $nin: block_user }
                    }
                  ]
                }
              },
              {
                $sort: {
                  createdAt: -1,
                  boosted_upto: -1//Sort by Date Added DESC

                }
              },
              {
                $facet: {
                  "stage1": [{ "$group": { _id: null, count: { $sum: 1 } } }],
                  "stage2": [{ $skip: startIndex },
                  { $limit: limit }]

                }
              },

              { $unwind: "$stage1" },

              //output projection
              {
                $project: {
                  product: "$stage2",
                  total: "$stage1.count"

                }
              }], function (err, product) {
                if (err)
                  res.json({ success: false, error: err });

                else {
                  if (product.length > 0)
                    res.json({ success: true, data: { product: product[0].product, total: product[0].total } });
                  else
                    res.json({ success: true, data: { product: [], total: 0 } });
                }
              });
            } else {
              Product.aggregate([{
                $geoNear: {
                  near: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                  },
                  distanceField: "dist",
                  maxDistance: distance,
                  spherical: true
                }
              }, {
                $match: {
                  $and: [{ category: category },
                  { country: country },
                  { isBlock: false },
                  { soldOut: false },
                  { "createdAt": { $gt: date } },

                  { "product_price": { $gte: min_price } },
                  { "product_price": { $lte: max_price } },
                  {
                    user_id: { $nin: block_user }
                  }
                  ]
                }
              },
              {
                $sort: {
                  createdAt: -1,
                  boosted_upto: -1//Sort by Date Added DESC

                }
              },
              {
                $facet: {
                  "stage1": [{ "$group": { _id: null, count: { $sum: 1 } } }],
                  "stage2": [{ $skip: startIndex },
                  { $limit: limit }]

                }
              },

              { $unwind: "$stage1" },

              //output projection
              {
                $project: {
                  product: "$stage2",
                  total: "$stage1.count"

                }
              }], function (err, product) {
                if (err)
                  res.json({ success: false, error: err });

                else {
                  if (product.length > 0)
                    res.json({ success: true, data: { product: product[0].product, total: product[0].total } });
                  else
                    res.json({ success: true, data: { product: [], total: 0 } });
                }
              });
            }

            break;
          default: res.json({ success: false, message: "Empty filter" });
        }
      })
    }
  }
}
exports.like_product = function (req, res) {
  var _id = req.body.product_id;
  var user_id = req.decoded._id;
  if (!_id) {
    res.json({ success: false, message: "Product id not found" });
  }

  Product.findOneAndUpdate({ _id: _id }, { $push: { likelist: user_id } }, { new: true }, function (err, product) {
    if (err)
      res.json({ success: false, error: err });
    else {
      User.findById(product.user_id, function (err, user) {
        if (err) {
          console.log({ success: false, message: "User not found" });
        }
        User.findById(user_id, function (err, user2) {
          if (err) {
            console.log({ success: false, message: "User not found" });
          }
          let username = user2.username ? user2.username : "Trade User"
          /*if (user2.notification.push.user_visit_product)//hey user1, user2 has liked your listing
            pushNotification(product.user_id, "Hey ", `${username} has liked your listing`, "product_liked", user_id, product._id)
          if (user2.notification.email.user_visit_product)
            mail_notification(product.user_id, `${username} has liked your listing .`, "product_liked", "", product._id, "Liked");*/
          res.json({ success: true });
        })

      })
    }
  });
}
exports.dislike_product = function (req, res) {
  var _id = req.body.product_id;
  var user_id = req.decoded._id;
  if (!_id) {
    res.json({ success: false, message: "Product id not found" });
  }

  Product.findOneAndUpdate({ _id: _id }, { $pull: { likelist: user_id } }, { new: true }, function (err, product) {
    if (err)
      res.json({ success: false, error: err });
    else
      res.json({ success: true });
  });
}
exports.likelist = function (req, res) {
  var user_id = new ObjectID(req.decoded._id);
  Product.find({ likelist: user_id }, (err, product1) => {
    if (err)
      res.json({ success: false, error: err });
    else {
      Freebies.find({ likelist: user_id }, (err, freebies) => {
        if (err)
          res.json({ success: false, error: err });
        else {
          let product = [...product1, ...freebies]
          res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
        }
      })
    }


  })
}
exports.list = function (req, res) {
  var user_id = req.decoded._id;
  Product.aggregate(
    [
      {
        $project:
        {
          likelist: 1,
          discount:
          {
            $cond: { if: { likelist: user_id }, then: 1, else: 0 }
          }
        }
      }
    ]
  ), (err, product) => {
    if (err)
      res.json({ success: false, error: err });
    else
      res.json({ success: true, data: product });
  }
}
exports.product_details = async (req, res) => {
  const _id = req.params.product_id;
  console.log(_id, '_id_id_id_id_id_id')

  if (!_id) {
    res.json({ success: false, message: 'Empty product_id ' });
  }
  try {
    let product = await Product.findById(_id).lean();
    if (product.sub_category_number[1] && product.sub_category_number[1].key == 'range')
      product.sub_category_number[1].value += ` ${product.sub_category[5].value}`;
    res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
  } catch (err) {
    res.json({ success: false, error: err });
  }

}

exports.expire_product = function (req, res) {
  var user_id = req.decoded._id;
  let curr_date = new Date().getTime();
  let minus = 3 * 30 * 24 * 60 * 60 * 1000; //3 month
  let date = new Date(curr_date - minus);
  Product.find({
    $and: [
      { user_id: new ObjectID(user_id) },
      {
        "createdAt": { $lte: date }
      },
    ]
  }
    , function (err, product) {
      if (err)
        res.json({ success: false, error: err });
      Freebies.find({
        $and: [
          { user_id: new ObjectID(user_id) },
          {
            "createdAt": { $lte: date }
          },
        ]
      }
        , function (err, freebies) {
          if (err)
            res.json({ success: false, error: err });
          res.json({ success: true, data: { product, freebies, "productImageUrl": config.__image_url } });
        });
      //res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
    });
};

exports.delete_expire_product = function (req, res) {
  var product_id = req.params.product_id ? req.params.product_id : req.body.product_id;
  var user_id = req.decoded._id;
  if (!product_id) {
    res.json({ success: false, message: "Product_id not found" });
  }
  Product.find({ $and: [{ _id: product_id }, { user_id: user_id }] }, function (err, prod) {
    if (!err) {
      if (prod.length == 0) {
        Freebies.find({ $and: [{ _id: product_id }, { user_id: user_id }] }, function (err, fprod) {
          if (!err) {
            if (fprod.length == 0) {
              res.json({ success: false, message: "You can't delete this product" });
            }
            Freebies.remove({ _id: product_id }, function (err, product) {
              if (err)
                res.json({ success: false, error: err });
              var images = fprod[0].image;
              images.forEach(function (item, i) {
                S3Helper.removeObj(config.AWS_S3_BUCKET, item)
                // var path = '././uploads/productImages/' + item;
                // require("fs").unlink(path, (err) => {
                //   if (!err) {
                //     console.log("Data deleted successfully", path);
                //   } else {
                //     console.log("Data deleted failed ", path);
                //   }
                // })
              });
              res.json({ success: true, message: 'Product successfully deleted' });
            })
          }
        })
      } else {
        Product.remove({ _id: product_id }, function (err, product) {
          if (err)
            res.json({ success: false, error: err });
          var images = prod[0].image;
          images.forEach(function (item, i) {
            S3Helper.removeObj(config.AWS_S3_BUCKET, item)
            // var path = '././uploads/productImages/' + item;
            // require("fs").unlink(path, (err) => {
            //   if (!err) {
            //     console.log("Data deleted successfully", path);
            //   } else {
            //     console.log("Data deleted failed ", path);
            //   }
            // })
          });
          res.json({ success: true, message: 'Product successfully deleted' });
        })
      }

    }
  })

}

function pushNotification(user_id, notification_title, notification_message, click_action = "", sender_id = "", product_id = "", seller_id = "", image = "") {
  let data = {}
  data.image = image
  data.receiver_id = user_id
  data.message = notification_message
  data.click_action = click_action
  data.sender_id = sender_id
  data.seller_id = seller_id
  data.product_id = product_id
  data.product_type = "Product"

  var serverKey = config.server_key;
  var fcm = new FCM(serverKey);

  User.findById(user_id, function (err, user) {
    if (err)
      console.log({ success: false, error: err, message: "Error in push notification" });
    if (user && user.notification_token) {
      let username = user.username ? user.username : "Trade User"
      if (click_action != "chat")
        data.title = notification_title + username
      else
        data.title = notification_title
      var message = {
        to: user.notification_token,
        collapse_key: 'your_collapse_key',
        notification: {
          title: data.title,
          body: notification_message,
          click_action: "FCM_PLUGIN_ACTIVITY",
          icon: "fcm_push_icon"
        }
      };
      fcm.send(message, function (err, response) {
        if (err) {
          console.log("Something has gone wrong! " + err);
        } else {
          console.log("Successfully sent with response: " + response);
        }
        notificationController.add_Notification(data)
      });
    } else {
      console.log(`user notification_token not found ${user_id}`)
      let username = user.username ? user.username : "Trade User"
      if (click_action != "chat")
        data.title = notification_title + username
      else
        data.title = notification_title
      notificationController.add_Notification(data)
    }
  })

}
function mail_notification(user_id, notification_message, click_action = "", sender_id = "", product_id = "", type = "") {
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
  User.findById(user_id, function (err, user) {
    if (err)
      console.log({ success: false, error: err, message: "Error in Mail notification" });
    if (user && user.email) {
      var mailOptions = {
        from: config.email.fromName,
        to: user.email,
        subject: 'Trade Notification',
        template: 'notification_template',
        context: {
          name: user.username ? user.username : 'User',
          message: notification_message,
          url: "https://trademylist.com/app",
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
    } else {
      console.log({ success: false, message: "Email not found" });
    }
  })

}
exports.chat_push = (req, res) => {
  let user_id = req.body.receiver_id,
    message = req.body.message ? req.body.message : "",
    product_id = req.body.product_id ? req.body.product_id : "",
    seller_id = req.body.seller_id ? req.body.seller_id : "",
    sender_id = req.body.sender_id ? req.body.sender_id : req.decoded._id

  User.findById(sender_id, { username: 1, email: 1, notification: 1 }, (err, sender) => {
    if (err)
      console.log(err)
    User.findById(user_id, { username: 1, email: 1, notification: 1 }, (err, data) => {
      if (err)
        console.log(err)

      let user = sender.username ? sender.username : "Trade User"
      if (data.notification && data.notification.push.chat)//You have a message from user
        pushNotification(user_id, `You have a message from ${user}`, message, "chat", sender_id, product_id, seller_id)
      if (data.notification && data.notification.email.chat) {
        let message_data = `You have a message from ${user}  
        \"${message}\"`
        mail_notification(user_id, message_data, "chat", req.decoded_id, product_id, "Chat")

      }

      res.json({ success: true, message: `Push enable ${data.notification.push.chat}` });
    })
  })
}

exports.check_expire_product = () => {
  let curr_date = new Date().getTime();
  let minus = 3 * 30 * 24 * 60 * 60 * 1000;   //3 month
  let max_interval = (3 * 30 * 24 * 60 * 60 * 1000) - 1;
  let date = new Date(curr_date - minus);
  let stop_notify_date = new Date(curr_date - max_interval)
  Product.find({
    $and: [
      { "createdAt": { $lte: date } },
      { "createdAt": { $gte: stop_notify_date } }
    ]
  }, function (err, product) {
    if (err)
      res.json({ success: false, error: err });
    Freebies.find({
      $and: [
        { "createdAt": { $lte: date } },
        { "createdAt": { $gte: stop_notify_date } }
      ]
    }, function (err, freebies) {
      if (err)
        res.json({ success: false, error: err });
      let result = [...product, ...freebies]
      result.forEach(element => {
        User.findById(element.user_id, function (err, user_details) {
          if (err) {
            console.log({ success: false, message: "User not found" });
          }
          if (user_details.notification.push.expired_product)
            pushNotification(element.user_id, "Hey ", `${element.product_name} expired `, "product_expired", "", element._id);
          if (user_details.notification.email.expired_product)
            mail_notification(element.user_id, `${element.product_name} expired `, "product_expired", "", element._id, "Expired product")
        })
        if (element.likelist)
          element.likelist.forEach(inner_element => {
            User.findById(inner_element, function (err, user) {
              if (err) {
                console.log({ success: false, message: "User not found" });
              }
              if (user && user.notification.push.expired_favorite_product)
                pushNotification(inner_element, "Hey ", `Your favorite product ${element.product_name} is expired `, "product_expired", "", element._id);
              if (user && user.notification.email.expired_favorite_product)
                mail_notification(inner_element, `Your favorite product ${element.product_name} is expired .`, "product_expired", "", element._id, "Expired product")
            })
          });
      });
    });
  });
}
exports.check_boosted_product = () => {
  let curr_date = Math.floor(Date.now() / 1000);

  Product.update({
    $and: [
      { "boosted_upto": { $lte: curr_date } },
      { "boost": 1 }
    ]
  }, { $set: { "boost": 0, "boosted_upto": 0 } }, { multi: true }, function (err, product) {
    if (err)
      console.log(`check boosting error ${err}`);
    console.log(`Boost checked ${JSON.stringify(product)} `)
  })
  Freebies.update({
    $and: [
      { "boosted_upto": { $lte: curr_date } },
      { "boost": 1 }
    ]
  }, { $set: { "boost": 0 } }, { multi: true }, function (err, product) {
    if (err)
      console.log(`check boosting error ${err}`);
    console.log(`Boost checked ${JSON.stringify(product)} `)
  })
}

exports.favorite_list = (req, res) => {
  let product_id = req.body.product_id;
  Product.findById(product_id, function (err, result) {
    if (err)
      res.json({ success: false, error: err });
    if (!result) {
      Freebies.findById(product_id, function (err, result1) {
        if (err)
          res.json({ success: false, error: err });
        User.find({ _id: { $in: result1.likelist } }, { email: 1, image: 1, address: 1, username: 1, geometry: 1, createdAt: 1 }, function (err, user) {
          if (err)
            res.json({ success: false, error: err });
          res.json({ success: true, message: 'favorite user list', data: { path: config.__profile_image_url, user } })
        })
      })
    } else {
      User.find({ _id: { $in: result.likelist } }, { email: 1, image: 1, address: 1, username: 1, geometry: 1, createdAt: 1 }, function (err, user) {
        if (err)
          res.json({ success: false, error: err });
        res.json({ success: true, message: 'favorite user list', data: { path: config.__profile_image_url, user } })
      })
    }
    //result.likelist.forEach(element => {

  })
}

exports.any_product_details = function (req, res) {
  const _id = req.body.product_id;
  if (!_id) {
    res.json({ success: false, message: 'Empty product_id ' });
  }
  Product.findById(_id, function (err, product) {
    if (err)
      res.json({ success: false, error: err });
    if (!product) {
      Freebies.findById(_id, function (err, product) {
        if (err)
          res.json({ success: false, error: err });
        res.json({ success: true, data: { product, "productImageUrl": config.__image_url } })
      })
    } else {
      res.json({ success: true, data: { product, "productImageUrl": config.__image_url } })
    }

  });
}

const FindBlockUser = async (userId) => {
  return await User.findOne({ _id: userId }).lean()
}


const car_service_filter = async (userId, doc, page, limit) => {
  try {
    let {
      category,
      latitude,
      longitude,
      country,
      distance,
      sortBy,
      unit,
      search_key
    } = doc

    const startIndex = (page - 1) * limit
    let no_of_day =  90; //3 month
    let min_price = doc.price[0].lower ? parseFloat(doc.price[0].lower) : 0;
    let max_price = doc.price[0].upper ? parseFloat(doc.price[0].upper) : 100000000;
    let curr_date = new Date().getTime();
    let minus = no_of_day * 24 * 60 * 60 * 1000;
    let date = new Date(curr_date - minus);
    let range = doc.range ? doc.range : 50000000;
    let query = {}, query1 = {};//, query2 = {}, query3 = {}, query4 = {};

    if (unit) {
      if (unit == 'Km' || unit == 'km')  //default is 500 mile
        distance = distance ? distance * 1000 : 500000 //converting km to m 
      else
        distance = distance ? distance * 1609 : 804672 //converting Miles to m
    } else {
      if (MilesCountryList.includes(country.toUpperCase()))
        distance = distance ? distance * 1609 : 804672
      else
        distance = distance ? distance * 1000 : 500000

    }
    console.log(distance)

    if (latitude && longitude) {
      query.geometry = {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: distance
        }
      }
    }
    if (search_key) {
      query = {
        $or: [
          { product_name: new RegExp(search_key, 'i') },
          { product_description: new RegExp(search_key, 'i') }
        ]
      }
    }
    if (country)
      query.country = country
    if (category && category != 'All categories')
      query.category = category

    query.isBlock = false
    query.soldOut = false
    query.createdAt = { $gt: date }
    query.product_price = { $gte: min_price, $lte: max_price }

    let block_user = await FindBlockUser(userId)
    if (block_user)
      query.user_id = { $nin: block_user.block_user_id }


    let make = new RegExp(doc.make ? doc.make : ".*", 'i')
    // query.sub_category = { $elemMatch: { key: "make", value: make } }
    let model = new RegExp(doc.model ? doc.model : ".*", 'i')
    //query1.sub_category = { $elemMatch: { key: "model", value: model } }
    let seller = new RegExp(doc.seller ? doc.seller : ".*", 'i')
    //query2.sub_category = { $elemMatch: { key: "seller", value: seller } }
    let transmission = new RegExp(doc.transmission ? doc.transmission : ".*", 'i')
    //query3.sub_category = { $elemMatch: { key: "transmission", value: transmission } }
    let trim = new RegExp(doc.trim ? doc.trim : ".*", 'i')
    //query4.sub_category = { $elemMatch: { key: "trim", value: trim } }
    //query.sub_category_number = { $elemMatch: { key: "range", value: { $lte: range } } }
    let min_year = doc.year ? doc.year.lower : 1800
    let max_year = doc.year ? doc.year.upper : 3000
    // query1.sub_category_number = { $elemMatch: { key: "year", value: { $gte: min_year, $lte: max_year } } }

    query1 = {
      $and: [
        { sub_category: { $elemMatch: { key: "make", value: make } } },
        { sub_category: { $elemMatch: { key: "model", value: model } } },
        { sub_category: { $elemMatch: { key: "seller", value: seller } } },
        { sub_category: { $elemMatch: { key: "transmission", value: transmission } } },
        { sub_category: { $elemMatch: { key: "trim", value: trim } } },
        { sub_category_number: { $elemMatch: { key: "range", value: { $lte: range } } } },
        { sub_category_number: { $elemMatch: { key: "year", value: { $gte: min_year, $lte: max_year } } } }
      ]
    }


    let product
    switch (sortBy) {
      case "Distance": product = await Product.find(query)
        .find(query1)//.find(query2).find(query3)
        .sort({
          dist: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      case "PriceAsc": product = await Product.find(query)
        .find(query1)//.find(query2).find(query3)
        .sort({
          product_price: 1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      case "PriceDesc": product = await Product.find(query)
        .find(query1)//.find(query2).find(query3)
        .sort({
          product_price: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      case "PublishRecent": product = await Product.find(query)
        .find(query1)//.find(query2).find(query3)
        .sort({
          createdAt: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      default: product = await Product.find(query)
        .find(query1)//.find(query2).find(query3)
        .sort({
          dist: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
    }
    const count = await Product.find(query)
      .find(query1).count();//.find(query2).find(query3)
    return { product, count }
  } catch (error) {
    console.log(error)
    throw error
  }

}
const house_service_filter = async (userId, doc, page, limit) => {
  try {
    let {
      category,
      latitude,
      longitude,
      country,
      distance,
      sortBy,
      unit,
      search_key
    } = doc

    const startIndex = (page - 1) * limit
    let no_of_day = 90; //3 month
    let min_price = doc.price[0].lower ? parseFloat(doc.price[0].lower) : 0;
    let max_price = doc.price[0].upper ? parseFloat(doc.price[0].upper) : 100000000;
    let curr_date = new Date().getTime();
    let minus = no_of_day * 24 * 60 * 60 * 1000;
    let date = new Date(curr_date - minus);
    let query = {}, query1 = {};

    if (unit) {
      if (unit == 'Km' || unit == 'km')  //default is 500 mile
        distance = distance ? distance * 1000 : 500000 //converting km to m 
      else
        distance = distance ? distance * 1609 : 804672 //converting Miles to m
    } else {
      if (country && MilesCountryList.includes(country.toUpperCase()))
        distance = distance ? distance * 1609 : 804672
      else
        distance = distance ? distance * 1000 : 500000

    }
    console.log(distance)
    //}
    if (latitude && longitude) {
      query.geometry = {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: distance
        }
      }
    }
    if (search_key) {
      query = {
        $or: [
          { product_name: new RegExp(search_key, 'i') },
          { product_description: new RegExp(search_key, 'i') }
        ]
      }
    }

    if (country)
      query.country = country
    if (category && category != 'All categories')
      query.category = category

    query.isBlock = false
    query.soldOut = false
    query.createdAt = { $gt: date }
    query.product_price = { $gte: min_price, $lte: max_price }

    let block_user = await FindBlockUser(userId)
    if (block_user)
      query.user_id = { $nin: block_user.block_user_id }


    let typeList = new RegExp(doc.typeList ? doc.typeList : ".*", 'i')
    //query.sub_category = { $elemMatch: { key: "typeList", value: typeList } }
    let propertyType = new RegExp(doc.propertyType ? doc.propertyType : ".*", 'i')
    //query1.sub_category = { $elemMatch: { key: "propertyType", value: propertyType } }
    let bedRoomNo = doc.bedRoomNo ? doc.bedRoomNo : 1
    // query.sub_category_number = { $elemMatch: { key: "bedRoomNo", value: { $gte: bedRoomNo } } }
    let bathRoomNo = doc.bathRoomNo ? doc.bathRoomNo : 1
    //query1.sub_category_number = { $elemMatch: { key: "bathRoomNo", value: { $gte: bathRoomNo } } }

    query1 = {
      $and: [
        { sub_category: { $elemMatch: { key: "typeList", value: typeList } } },
        { sub_category: { $elemMatch: { key: "propertyType", value: propertyType } } },
        { sub_category_number: { $elemMatch: { key: "bedRoomNo", value: { $gte: bedRoomNo } } } },
        { sub_category_number: { $elemMatch: { key: "bathRoomNo", value: { $gte: bathRoomNo } } } }
      ]
    }

    let product

    switch (sortBy) {
      case "Distance": product = await Product.find(query)
        .find(query1)
        .sort({
          dist: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      case "PriceAsc": product = await Product.find(query)
        .find(query1)
        .sort({
          product_price: 1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      case "PriceDesc": product = await Product.find(query)
        .find(query1)
        .sort({
          product_price: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      case "PublishRecent": product = await Product.find(query)
        .find(query1)
        .sort({
          createdAt: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      default: product = await Product.find(query)
        .find(query1)
        .sort({
          dist: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
    }
    const count = await Product.find(query).find(query1).count();
    return { product, count }
  } catch (error) {
    console.log(error)
    throw error
  }

}
const job_service_filter = async (userId, doc, page, limit) => {
  try {
    let {
      category,
      latitude,
      longitude,
      country,
      distance,
      sortBy,
      unit,
      search_key
    } = doc

    const startIndex = (page - 1) * limit
    let no_of_day =  90; //3 month
    let min_price = doc.price[0].lower ? parseFloat(doc.price[0].lower) : 0;
    let max_price = doc.price[0].upper ? parseFloat(doc.price[0].upper) : 100000000;
    let curr_date = new Date().getTime();
    let minus = no_of_day * 24 * 60 * 60 * 1000;
    let date = new Date(curr_date - minus);
    let query = {}


    if (unit) {
      if (unit == 'Km' || unit == 'km')  //default is 500 mile
        distance = distance ? distance * 1000 : 500000 //converting km to m 
      else
        distance = distance ? distance * 1609 : 804672 //converting Miles to m
    } else {
      if (country && MilesCountryList.includes(country.toUpperCase()))
        distance = distance ? distance * 1609 : 804672
      else
        distance = distance ? distance * 1000 : 500000

    }
    console.log(distance)

    if (latitude && longitude) {
      query.geometry = {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: distance
        }
      }
    }
    if (search_key) {
      query = {
        $or: [
          { product_name: new RegExp(search_key, 'i') },
          { product_description: new RegExp(search_key, 'i') }
        ]
      }
    }
    if (country)
      query.country = country
    if (category && category != 'All categories')
      query.category = category

    query.isBlock = false
    query.soldOut = false
    query.createdAt = { $gt: date }
    query.product_price = { $gte: min_price, $lte: max_price }

    let block_user = await FindBlockUser(userId)
    if (block_user)
      query.user_id = { $nin: block_user.block_user_id }

    if (doc.category == 'Jobs' || doc.category == 'Services') {
      let type_of_job = new RegExp(doc.type_of_job ? doc.type_of_job : ".*", 'i')
      query.sub_category = { $elemMatch: { key: "type_of_job", value: type_of_job } }
    }
    console.log(query)
    let product
    switch (sortBy) {
      case "Distance": product = await Product.find(query)
        .sort({
          dist: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      case "PriceAsc": product = await Product.find(query)
        .sort({
          product_price: 1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      case "PriceDesc": product = await Product.find(query)
        .sort({
          product_price: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      case "PublishRecent": product = await Product.find(query)
        .sort({
          createdAt: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      default: product = await Product.find(query)
        .sort({
          dist: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
    }
    const count = await Product.find(query).count();
    return { product, count }
  } catch (error) {
    console.log(error)
    throw error
  }

}

const multiple_filter = async (userId, doc, page, limit) => {
  try {
    let {
      category,
      latitude,
      longitude,
      country,
      distance,
      sortBy,
      unit,
      search_key
    } = doc
    const startIndex = (page - 1) * limit
    let no_of_day = 90; //3 month
    let min_price = doc.price[0].lower ? parseFloat(doc.price[0].lower) : 0;
    let max_price = doc.price[0].upper ? parseFloat(doc.price[0].upper) : 100000000;
    let curr_date = new Date().getTime();
    let minus = no_of_day * 24 * 60 * 60 * 1000;
    let date = new Date(curr_date - minus);
    let query = {}

    // if (unit == 'Miles' || unit == 'miles')  //default is 500 mile
    //   distance = distance ? distance * 1000 : 500 * 1000 //converting Miles to m 
    // else
    distance = distance ? distance : 804672 //converting km to m

    if (latitude && longitude) {
      query.geometry = {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: distance
        }
      }
    }
    if (search_key) {
      query = {
        $or: [
          { product_name: new RegExp(search_key, 'i') },
          { product_description: new RegExp(search_key, 'i') }
        ]
      }
    }

    if (country)
      query.country = country
    query.isBlock = false
    query.soldOut = false
    query.createdAt = { $gt: date }
    query.product_price = { $gte: min_price, $lte: max_price }

    let block_user = await FindBlockUser(userId)
    if (block_user)
      query.user_id = { $nin: block_user.block_user_id }

    query.category = { $in: category }
    let product;
    switch (sortBy) {
      case "Distance": product = await Product.find(query)
        .sort({
          dist: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      case "PriceAsc": product = await Product.find(query)
        .sort({
          product_price: 1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      case "PriceDesc": product = await Product.find(query)
        .sort({
          product_price: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      case "PublishRecent": product = await Product.find(query)
        .sort({
          createdAt: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      default: product = await Product.find(query)
        .sort({
          dist: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
    }
    //return product
    const count = await Product.find(query).count();
    return { product, count }
  } catch (error) {
    console.log(error)
    throw error
  }

}


exports.add_product_image = (req, res) => {
  var image = [];
  req.files.forEach(function (val, index) {
    // if (req.files[index].originalname)
    //   image.push(req.files[index].transforms[0].location);
    image.push(req.files[index].location);
  })

  res.json({ success: true, message: "Success", data: { image: image[0], path: config.__image_url } });
}
exports.add_product_array_image = (req, res) => {
  var image = [];
  req.files.forEach(function (val, index) {
    if (req.files[index].originalname)
      image.push(req.files[index].transforms[0].location);
    image.push(req.files[index].location);
  })

  res.json({ success: true, message: "Success", data: { image: image, path: config.__image_url } });
}
exports.add_chat_image = (req, res) => {
  var image = [];
  req.files.forEach(function (val, index) {
    image.push(req.files[index].location);
  })

  res.json({ success: true, message: "Success", data: { image: image[0] } })
}
