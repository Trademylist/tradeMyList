'use strict';

var mongoose = require('mongoose'),
  FCM = require('fcm-node'),
  Freebies = mongoose.model('Freebies'),
  User = mongoose.model('Users'),
  config = require('../../config'),
  nodemailer = require('nodemailer'),
  notificationController = require('./notificationController'),
  hbs = require('nodemailer-express-handlebars');

var multer = require('multer');
var path = require('path');
var ObjectID = require('mongodb').ObjectID;
const MilesCountryList = ["USA", "US", "United States", "LBR", "Liberia", "MMR", "Myanmar", "Myanmar (Burma)"]



exports.upload_image = function (req, res, next) {
  var upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './uploads/productImages/')
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname.split('.')[0] + Date.now() + path.extname(file.originalname))

      }
    })
  })
  return upload.array('image', 12)(req, res, next);
};

exports.add_product = function (req, res) {
  var image = [];
  req.files.forEach(function (val, index) {
    image.push(req.files[index].filename);
  })
  req.body.image = image;
  req.body.user_id = req.decoded._id;
  req.body.country = req.decoded.country;//add country according to token
  var new_product = new Freebies(req.body);
  new_product.save(function (err, product) {
    if (err)
      res.json({ success: false, message: err });
    res.json({ success: true, data: product, message: 'Product successfully created' });
  });
};

exports.deleteProduct = function (req, res) {
  var freebies_id = req.params.freebies_id;
  if (!freebies_id) {
    res.json({ success: false, message: "Freebies_id not found" });
  }
  Freebies.remove({ _id: freebies_id }, function (err, product) {
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
    res.json({ success: true, message: 'Freebies successfully deleted' });
  });
};

exports.get_all = function (req, res) {
  var country = req.decoded ? req.decoded.country : null;
  if (country && country[0] != null) {
    Freebies.find({ country: { $in: country } }, function (err, product) {
      if (err)
        res.json({ success: false, error: err });
      res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
    });
  } else {
    Freebies.find(function (err, product) {
      if (err)
        res.json({ success: false, error: err });
      res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
    });
  }
};

exports.get_all_new = function (req, res) {
  var country = req.decoded ? req.decoded.country : null;
  if (country && country[0] != null) {
    Freebies.find({ country: { $in: country } }, function (err, product) {
      if (err)
        res.json({ success: false, error: err });
      res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
    }).populate("user_id");
  } else {
    Freebies.find(function (err, product) {
      if (err)
        res.json({ success: false, error: err });
      res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
    }).populate("user_id");
  }
};

exports.productByCategory = function (req, res) {
  var category = req.body.category;
  Freebies.find({ category: category }, function (err, user) {
    if (err)
      res.json({ success: false, error: err });
    res.json({ success: true, data: user });
  });
};

exports.nearBy = function (req, res) {
  Freebies.aggregate([{
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

  }, error => {
    console.log("errorrr", error);
  })

};

exports.search_product = function (req, res) {
  var svalue = req.body.search_value;
  if (!svalue) {
    res.json({ success: false, message: 'search value required' });
  }
  const userRegex = new RegExp(svalue, 'i');
  var country = req.decoded ? req.decoded.country : null;

  if (country && country[0] != null) {
    Freebies.find({
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
    Freebies.find({ product_name: userRegex }
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
  Freebies.findOneAndUpdate({ _id: _id }, req.body, { new: true }, function (err, product) {
    if (err)
      res.json({ success: false, error: err });
    else
      res.json({ success: true, message: 'Product updated successfully', data: product });
  });
};

exports.count = function (req, res) {
  Freebies.count(function (err, cnt) {
    if (err)
      res.json({ success: false, error: err });
    res.json({ success: true, data: { name: 'Freebies', path: 'freebies', count: cnt } });
  });
};

//normal user
exports.product_listing = function (req, res) {
  console.log(req.body)
  const page = req.query.page ? parseInt(req.query.page) : 1
  const limit = req.query.limit ? parseInt(req.query.limit) : 10
  const startIndex = (page - 1) * limit
  let curr_date = new Date().getTime();
  let minus = 3 * 30 * 24 * 60 * 60 * 1000;//3 month
  let date = new Date(curr_date - minus);
  var latitude = req.body.latitude ? parseFloat(req.body.latitude) : 22.5738752;
  var longitude = req.body.longitude ? parseFloat(req.body.longitude) : 88.375296;
  var distance = req.body.distance ? req.body.distance : 804672;
  var country = req.body.country ? req.body.country : null;
  var search_key = new RegExp(req.body.search_key ? req.body.search_key : ".*", 'i')
  var category = new RegExp(req.body.category ? req.body.category : ".*", 'i')
  Freebies.aggregate([{
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
        //{ country: country },
        { category: category }
      ],
      $or: [
        { product_name: search_key },
        { product_description: search_key }
      ]
    }
  }, {
    $sort: {
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
  console.log(req.body, "", distance)
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
  User.findOne({ _id: req.decoded._id }, function (err, docs) {
    if (err)
      res.json({ success: false, error: err });
    let block_user = []
    if (docs && docs.block_user_id)
      docs.block_user_id.forEach((element, index) => {
        block_user[index++] = new ObjectID(element);
      });
    Freebies.aggregate([{
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
        boosted_upto: -1,
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
  let curr_date = new Date().getTime();
  let minus = 3 * 30 * 24 * 60 * 60 * 1000; //3 month
  let date = new Date(curr_date - minus);
  var svalue = req.body.search_value;
  var country = req.body.country ? req.body.country : 'India';
  var latitude = req.body.latitude ? parseFloat(req.body.latitude) : 11;
  var longitude = req.body.longitude ? parseFloat(req.body.longitude) : 11;
  var distance = req.body.distance ? req.body.distance : 10000000000;
  if (!svalue) {
    res.json({ success: false, message: 'search value required' });
  }
  const userRegex = new RegExp(svalue, 'i');
  Freebies.aggregate([{
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
        //{ country: country },
        { product_name: userRegex },
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
  Freebies.find({
    $and: [
      { category: category },
      //{ country: country },
      { isBlock: false },
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

exports.soldout_list = function (req, res) {
  var user_id = req.decoded._id;
  console.log(user_id);
  Freebies.find({
    $and: [
      { user_id: new ObjectID(user_id) },
      { soldOut: true }
    ]
  }, function (err, product) {
    if (err)
      res.json({ success: false, error: err });
    res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
  });
};

exports.soldout = function (req, res) {
  var _id = req.body.product_id;
  if (!_id) {
    res.json({ success: false, message: "Product id not found" });
  }
  Freebies.findOneAndUpdate({ _id: _id }, { soldOut: true }, { new: true }, function (err, product) {
    if (err)
      res.json({ success: false, error: err });
    else {

      if (product.likelist)
        product.likelist.forEach(inner_element => {
          User.findById(inner_element, function (err, user) {
            if (err) {
              console.log({ success: false, message: "User not found" });
            }
            if (user.notification.push.soldOut_favorited_product)
              pushNotification(inner_element, "Hey ", `Your favorite product ${product.product_name} is sold out `, "soldout", "", product._id);
            if (user.notification.email.soldOut_favorited_product)
              mail_notification(inner_element, `Your favorite product ${product.product_name} is sold out .`, "soldout", "", product._id, "Sold Out");
          })

        });
      res.json({ success: true, message: 'Product updated successfully', data: product });
    }
  });
};

exports.resell = function (req, res) {
  var _id = req.body.product_id;
  if (!_id) {
    res.json({ success: false, message: "Product id not found" });
  }
  Freebies.findOneAndUpdate({ _id: _id }, { soldOut: false }, { new: true }, function (err, product) {
    if (err)
      res.json({ success: false, error: err });
    else
      res.json({ success: true, message: 'Product updated successfully', data: product });
  });
};

//seller
exports.reactivation_product = function (req, res) {
  var _id = req.body.product_id;
  if (!_id) {
    res.json({ success: false, message: "Product id not found" });
  }
  Freebies.updateOne({ _id: _id }, { $set: { createdAt: new Date() } }, function (err, product) {
    if (err)
      res.json({ success: false, error: err });
    else
      res.json({ success: true, message: 'Product reactivated successfully', data: product });
  });
}
exports.my_product = function (req, res) {
  var user_id = req.decoded._id;
  let curr_date = new Date().getTime();
  let minus = 3 * 30 * 24 * 60 * 60 * 1000; //3 month
  let date = new Date(curr_date - minus);
  Freebies.aggregate([{
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
  }], function (err, product) {
    if (err)
      res.json({ success: false, error: err });
    res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
  });
};
exports.product_filter_bck = function (req, res) {
  const page = req.query.page ? parseInt(req.query.page) : 1
  const limit = req.query.limit ? parseInt(req.query.limit) : 10
  const startIndex = (page - 1) * limit
  const _id = req.decoded ? req.decoded._id : null
  console.log("applied filter ", req.body);
  if (Array.isArray(req.body.category)) {// for web multiple category filter
    multiple_filter(_id, req.body, page, limit).then((product) => res.json({ success: true, data: { product: product.product, total: product.count } }))
      .catch(err => res.json({ success: false, message: err }))
  } else {
    var category = req.body.category ? req.body.category : 'null';
    if (category == 'Property') {
      property_filter(_id, req.body, page, limit).then((product) => res.json({ success: true, data: { product: product.product, total: product.count } }))
        .catch(err => res.json({ success: false, message: err }))
    } else if (category == 'Van & Trucks') {
      van_filter(_id, req.body, page, limit).then((product) => res.json({ success: true, data: { product: product.product, total: product.count } }))
        .catch(err => res.json({ success: false, message: err }))
    } else {
      let no_of_day = 90;//3 month
      let min_price = req.body.price[0].lower ? parseFloat(req.body.price[0].lower) : 0;
      let max_price = req.body.price[0].upper ? parseFloat(req.body.price[0].upper) : 100000000;
      let curr_date = new Date().getTime();
      let minus = no_of_day * 24 * 60 * 60 * 1000;
      let date = new Date(curr_date - minus);
      var latitude = req.body.latitude ? parseFloat(req.body.latitude) : 11;
      var longitude = req.body.longitude ? parseFloat(req.body.longitude) : 21.1;
      var country = req.body.country;
      var distance = req.body.distance ? parseInt(req.body.distance) : 804672;
      var sortBy = req.body.sortBy ? req.body.sortBy : 'PublishRecent';
      var unit = req.body.unit ? req.body.unit : 'Miles';


      if (!country)
        res.json({ success: false, message: "Empty Country" });


      // if (unit == 'Km' || unit == 'km')  //default is 500 mile = 804672 meter
      //   distance = distance ? distance * 1000 : 804672
      // else
      //   distance = distance ? distance * 1609 : 804672


      let block_user = []
      let _id = req.decoded_id ? req.decoded_id : null
      User.findOne({ _id: _id }, function (err, docs) {
        if (err)
          res.json({ success: false, error: err });
        if (docs)
          docs.block_user_id.forEach((element, index) => {
            block_user[index++] = new ObjectID(element);
          });

        console.log(block_user)
        switch (sortBy) {
          case "Distance":
            if (category == 'All categories') {
              Freebies.aggregate([{
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
                    //{ country: country },
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
                  boosted_upto: -1,//Sort by Date Added DESC

                  dist: -1
                }
              },
              { $skip: startIndex },
              { $limit: limit }], function (err, product) {
                if (err)
                  res.json({ success: false, error: err });

                res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
              });
            } else {
              Freebies.aggregate([{
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
                  //{ country: country },
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
                  boosted_upto: -1,//Sort by Date Added DESC

                  dist: -1
                }
              },
              { $skip: startIndex },
              { $limit: limit }], function (err, product) {
                if (err)
                  res.json({ success: false, error: err });
                res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
              });
            }
            break;
          case "PriceAsc":
            if (category == 'All categories') {
              Freebies.aggregate([{
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
                    //{ country: country },
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
              { $skip: startIndex },
              { $limit: limit }], function (err, product) {
                if (err)
                  res.json({ success: false, error: err });

                res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
              });
            } else {
              Freebies.aggregate([{
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
                  //{ country: country },
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
              { $skip: startIndex },
              { $limit: limit }], function (err, product) {
                if (err)
                  res.json({ success: false, error: err });
                res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
              });
            }
            break;
          case "PriceDesc":
            if (category == 'All categories') {
              Freebies.aggregate([{
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
                    //{ country: country },
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
                  product_price: -1,
                  boosted_upto: -1//Sort by Date Added DESC
                }
              },
              { $skip: startIndex },
              { $limit: limit }], function (err, product) {
                if (err)
                  res.json({ success: false, error: err });

                res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
              });
            } else {
              Freebies.aggregate([{
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
                  //{ country: country },
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
              { $skip: startIndex },
              { $limit: limit }], function (err, product) {
                if (err)
                  res.json({ success: false, error: err });
                res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
              });
            }
            break;
          case "PublishRecent":
            if (category == 'All categories') {
              console.log("distance", distance)
              Freebies.aggregate([{
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
                    //{ country: country },
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
              { $skip: startIndex },
              { $limit: limit }], function (err, product) {
                if (err)
                  res.json({ success: false, error: err });

                res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
              });
            } else {
              Freebies.aggregate([{
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
                  //{ country: country },
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
              { $skip: startIndex },
              { $limit: limit }], function (err, product) {
                if (err)
                  res.json({ success: false, error: err });

                res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
              });
            }

            break;
          default: res.json({ success: false, message: "Empty filter" });
        }
      })
    }
  }



}
exports.product_filter = function (req, res) {
  const page = req.query.page ? parseInt(req.query.page) : 1
  const limit = req.query.limit ? parseInt(req.query.limit) : 10
  const startIndex = (page - 1) * limit
  const _id = req.decoded ? req.decoded._id : null
  console.log("applied filter ", req.body);
  if (Array.isArray(req.body.category)) {// for web multiple category filter
    multiple_filter(_id, req.body, page, limit).then((product) => res.json({ success: true, data: { product: product.product, total: product.count } }))
      .catch(err => res.json({ success: false, message: err }))
  } else {
    var category = req.body.category ? req.body.category : 'All categories';
    if (category == 'Property') {
      property_filter(_id, req.body, page, limit).then((product) => res.json({ success: true, data: { product: product.product, total: product.count } }))
        .catch(err => res.json({ success: false, message: err }))
    } else if (category == 'Van & Trucks') {
      van_filter(_id, req.body, page, limit).then((product) => res.json({ success: true, data: { product: product.product, total: product.count } }))
        .catch(err => res.json({ success: false, message: err }))
    } else {
      let no_of_day = 90;//3 month
      let min_price = req.body.price[0].lower ? parseFloat(req.body.price[0].lower) : 0;
      let max_price = req.body.price[0].upper ? parseFloat(req.body.price[0].upper) : 100000000;
      let curr_date = new Date().getTime();
      let minus = no_of_day * 24 * 60 * 60 * 1000;
      let date = new Date(curr_date - minus);
      var latitude = req.body.latitude ? parseFloat(req.body.latitude) : 11;
      var longitude = req.body.longitude ? parseFloat(req.body.longitude) : 21.1;
      var country = req.body.country;
      var distance = req.body.distance;
      var sortBy = req.body.sortBy ? req.body.sortBy : 'PublishRecent';
      var unit = req.body.unit;

      var search_key = new RegExp(req.body.search_key ? req.body.search_key : ".*", 'i')




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

      let block_user = []
      let _id = req.decoded_id ? req.decoded_id : null
      User.findOne({ _id: _id }, function (err, docs) {
        if (err)
          res.json({ success: false, error: err });
        if (docs)
          docs.block_user_id.forEach((element, index) => {
            block_user[index++] = new ObjectID(element);
          });

        console.log(block_user)
        switch (sortBy) {
          case "Distance":
            if (category == 'All categories') {
              Freebies.aggregate([{
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
                    //{ country: country },
                    { isBlock: false },
                    { soldOut: false },
                    { "createdAt": { $gt: date } },
                    { "product_price": { $gte: min_price } },
                    { "product_price": { $lte: max_price } },
                    {
                      user_id: { $nin: block_user }
                    }
                  ],
                  $or: [
                    { product_name: search_key },
                    { product_description: search_key }
                  ]
                }
              },
              {
                $sort: {
                  boosted_upto: -1,//Sort by Date Added DESC

                  dist: -1
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
              Freebies.aggregate([{
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
                  //{ country: country },
                  { isBlock: false },
                  { soldOut: false },
                  { "createdAt": { $gt: date } },

                  { "product_price": { $gte: min_price } },
                  { "product_price": { $lte: max_price } },
                  {
                    user_id: { $nin: block_user }
                  }
                  ],
                  $or: [
                    { product_name: search_key },
                    { product_description: search_key }
                  ]
                }
              }, {
                $sort: {
                  boosted_upto: -1,//Sort by Date Added DESC

                  dist: -1
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
            if (category == 'All categories') {
              Freebies.aggregate([{
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
                    //{ country: country },
                    { isBlock: false },
                    { soldOut: false },
                    { "createdAt": { $gt: date } },
                    { "product_price": { $gte: min_price } },
                    { "product_price": { $lte: max_price } },
                    {
                      user_id: { $nin: block_user }
                    }
                  ],
                  $or: [
                    { product_name: search_key },
                    { product_description: search_key }
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
              Freebies.aggregate([{
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
                  //{ country: country },
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
            if (category == 'All categories') {
              Freebies.aggregate([{
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
                    //{ country: country },
                    { isBlock: false },
                    { soldOut: false },
                    { "createdAt": { $gt: date } },

                    { "product_price": { $gte: min_price } },
                    { "product_price": { $lte: max_price } },
                    {
                      user_id: { $nin: block_user }
                    }
                  ],
                  $or: [
                    { product_name: search_key },
                    { product_description: search_key }
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
              Freebies.aggregate([{
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
                  //{ country: country },
                  { isBlock: false },
                  { soldOut: false },
                  { "createdAt": { $gt: date } },

                  { "product_price": { $gte: min_price } },
                  { "product_price": { $lte: max_price } },
                  {
                    user_id: { $nin: block_user }
                  }
                  ],
                  $or: [
                    { product_name: search_key },
                    { product_description: search_key }
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
            if (category == 'All categories') {
              Freebies.aggregate([{
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
                    //{ country: country },
                    { "product_price": { $gte: min_price } },
                    { "product_price": { $lte: max_price } },
                    {
                      user_id: { $nin: block_user }
                    }
                  ],
                  $or: [
                    { product_name: search_key },
                    { product_description: search_key }
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
              }

              ], function (err, product) {
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
              Freebies.aggregate([{
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
                  //{ country: country },
                  { isBlock: false },
                  { soldOut: false },
                  { "createdAt": { $gt: date } },
                  { "product_price": { $gte: min_price } },
                  { "product_price": { $lte: max_price } },
                  {
                    user_id: { $nin: block_user }
                  }
                  ],
                  $or: [
                    { product_name: search_key },
                    { product_description: search_key }
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
//Van & Truck Filter
exports.van_truck_filter = function (req, res) {
  console.log("applied filter ", req.body);

  const page = req.query.page ? parseInt(req.query.page) : 1
  const limit = req.query.limit ? parseInt(req.query.limit) : 10
  const startIndex = (page - 1) * limit
  let no_of_day = 90; //3 month
  let min_price = req.body.price[0].lower ? parseFloat(req.body.price[0].lower) : 0;
  let max_price = req.body.price[0].upper ? parseFloat(req.body.price[0].upper) : 100000000;
  let curr_date = new Date().getTime();
  let minus = no_of_day * 24 * 60 * 60 * 1000;
  let date = new Date(curr_date - minus);
  var category = req.body.category ? req.body.category : 'null';
  var latitude = req.body.latitude ? parseFloat(req.body.latitude) : 11;
  var longitude = req.body.longitude ? parseFloat(req.body.longitude) : 21.1;
  var country = req.body.country;
  var distance = req.body.distance ? parseInt(req.body.distance) : 804672; //500 miles default
  var sortBy = req.body.sortBy ? req.body.sortBy : 'PublishRecent';
  var unit = req.body.unit ? req.body.unit : 'Miles';

  var make = new RegExp(req.body.make ? req.body.make : ".*", 'i'),
    model = new RegExp(req.body.model ? req.body.model : ".*", 'i'),
    seller = new RegExp(req.body.seller ? req.body.seller : ".*", 'i'),
    transmission = new RegExp(req.body.transmission ? req.body.transmission : ".*", 'i'),
    trim = new RegExp(req.body.trim ? req.body.trim : ".*", 'i'),
    range = req.body.range ? req.body.range : 99999999999

  let min_year = req.body.year ? parseInt(req.body.year.lower) : 1900,
    max_year = req.body.year ? parseInt(req.body.year.upper) : 2050;

  var search_key = new RegExp(req.body.search_key ? req.body.search_key : ".*", 'i')
  if (!country)
    res.json({ success: false, message: "Empty Country" });
  if (unit == 'Km' || unit == 'km') {
    distance *= 1000; //converting Km to m

  } else {
    distance *= 1609; //converting Miles to m
  }
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

        if (unit == 'Km' || unit == 'km') {
          range *= 0.621371;
        }

        Freebies.aggregate([{
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
            //{ country: country },
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
            ],
            $or: [
              { product_name: search_key },
              { product_description: search_key }
            ]
          }
        }, {
          $sort: {
            dist: -1,
            boosted_upto: -1//Sort by Date Added DESC

          }
        },
        { $skip: startIndex },
        { $limit: limit }], function (err, product) {
          if (err)
            res.json({ success: false, error: err });
          res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
        });

        break;
      case "PriceAsc":

        if (unit == 'Km' || unit == 'km') {
          range *= 0.621371;
        }

        Freebies.aggregate([{
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
            //{ country: country },
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
        { $skip: startIndex },
        { $limit: limit }], function (err, product) {
          if (err)
            res.json({ success: false, error: err });
          res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
        });

        break;
      case "PriceDesc":

        if (unit == 'Km' || unit == 'km') {
          range *= 0.621371;
        }

        Freebies.aggregate([{
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
            //{ country: country },
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
        { $skip: startIndex },
        { $limit: limit }], function (err, product) {
          if (err)
            res.json({ success: false, error: err });
          res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
        });


        break;
      case "PublishRecent":

        if (unit == 'Km' || unit == 'km') {
          range *= 0.621371;
        }

        Freebies.aggregate([{
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
            //{ country: country },
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
        { $skip: startIndex },
        { $limit: limit }], function (err, product) {
          if (err)
            res.json({ success: false, error: err });
          res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
        });


        break;
      default: res.json({ success: false, message: "Empty filter" });
    }
  })
}


exports.add_seller_product = function (req, res) {
  req.body.user_id = req.decoded._id;
  if (req.body.category == 'Van & Trucks') {

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
  } else if (req.body.category == 'Property') {
    const sub_category = [{
      key: 'furnishing',
      value: req.body.furnishing ? req.body.furnishing : null
    }, {
      key: 'construction_status',
      value: req.body.construction_status ? req.body.construction_status : null
    }, {
      key: 'listed_by',
      value: req.body.listed_by ? req.body.listed_by : null
    }];
    const sub_category_number = [{
      key: 'car_parking',
      value: req.body.car_parking ? req.body.car_parking : 0
    }, {
      key: 'super_builtup_area',
      value: req.body.super_builtup_area ? req.body.super_builtup_area : 0
    }, {
      key: 'carpet_area',
      value: req.body.carpet_area ? req.body.carpet_area : 0
    }, {
      key: 'maintenance',
      value: req.body.maintenance ? req.body.maintenance : 0
    }, {
      key: 'washrooms',
      value: req.body.washrooms ? req.body.washrooms : 0
    }];
    req.body.sub_category = sub_category;
    req.body.sub_category_number = sub_category_number;
  }

  if (!req.body.country)
    req.body.country = req.decoded.country;//add country according to token
  var new_product = new Freebies(req.body);
  new_product.save(function (err, product) {
    if (err)
      res.json({ success: false, message: err });
    res.json({ success: true, data: product, message: 'Product successfully created' });
  });
};
exports.update_seller_product = function (req, res) {
  var _id = req.body._id ? req.body._id : req.params.product_id;
  if (!_id) {
    res.json({ success: false, message: "Product id not found" });
  }
  if (req.body.category == 'Van & Trucks') {
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

  } else if (req.body.category == 'Property') {
    const sub_category = [{
      key: 'furnishing',
      value: req.body.furnishing ? req.body.furnishing : null
    }, {
      key: 'construction_status',
      value: req.body.construction_status ? req.body.construction_status : null
    }, {
      key: 'listed_by',
      value: req.body.listed_by ? req.body.listed_by : null
    }];
    const sub_category_number = [{
      key: 'car_parking',
      value: req.body.car_parking ? req.body.car_parking : 0
    }, {
      key: 'super_builtup_area',
      value: req.body.super_builtup_area ? req.body.super_builtup_area : 0
    }, {
      key: 'carpet_area',
      value: req.body.carpet_area ? req.body.carpet_area : 0
    }, {
      key: 'maintenance',
      value: req.body.maintenance ? req.body.maintenance : 0
    }, {
      key: 'washrooms',
      value: req.body.washrooms ? req.body.washrooms : 0
    }];
    req.body.sub_category = sub_category;
    req.body.sub_category_number = sub_category_number;
  }
  Freebies.findOne({ _id: _id }, function (err, old_product) {
    if (!(old_product.product_price == req.body.product_price)) {
      old_product.likelist.forEach(inner_element => {
        User.findById(inner_element, function (err, user) {
          if (err) {
            console.log({ success: false, message: "User not found" });
          }
          //console.log(user.notification.push.price_change_favorited_product)
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
          //console.log(user.notification.push.price_change_favorited_product)
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
          //console.log(user.notification.push.price_change_favorited_product)
          if (user.notification.push.image_change_favorited_product)
            pushNotification(inner_element, "Hey ", `Your favorite product ${old_product.product_name} image changed `, "product_update", "", old_product._id);
          if (user.notification.email.image_change_favorited_product)
            mail_notification(inner_element, `Your favorite product ${old_product.product_name} image changed .`, "product_update", "", old_product._id, "Media Changed");
        })

      });
    }
    Freebies.findOneAndUpdate({ _id: _id }, req.body, { new: true }, function (err, product) {
      if (err)
        res.json({ success: false, error: err });
      else
        res.json({ success: true, message: 'Product updated successfully', data: product });
    });

  })
};
exports.delete_seller_product = function (req, res) {
  var product_id = req.params.product_id ? req.params.product_id : req.body.product_id;
  var user_id = req.decoded._id;
  if (!product_id) {
    res.json({ success: false, message: "Product_id not found" });
  }
  Freebies.find({ $and: [{ _id: product_id }, { user_id: user_id }] }, function (err, prod) {
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
      Freebies.remove({ _id: product_id }, function (err, product) {
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
          //     console.log("Data deleted failed ", path, " error: ", err);
          //   }
          // })
        });
        res.json({ success: true, message: 'Product successfully deleted' });
      })
    }
  })

};
exports.product_details = async (req, res) => {
  const _id = req.params.product_id;
  if (!_id) {
    res.json({ success: false, message: 'Empty product_id ' });
  }
  try {
    let product = await Freebies.findById(_id).lean();
    if (product.sub_category_number[1] && product.sub_category_number[1].key == 'range')
      product.sub_category_number[1].value += ` ${product.sub_category[5].value}`;
    res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
  } catch (err) {
    res.json({ success: false, error: err });
  }

}
exports.favorite_list = (req, res) => {
  let product_id = req.body.product_id;
  Freebies.findById(product_id, function (err, result) {
    if (err)
      res.json({ success: false, error: err });
    //result.likelist.forEach(element => {
    User.find({ _id: { $in: result.likelist } }, { email: 1, image: 1, address: 1, username: 1, geometry: 1, createdAt: 1 }, function (err, user) {
      if (err)
        res.json({ success: false, error: err });
      res.json({ success: true, message: 'favorite user list', data: { path: config.__profile_image_url, user } })
    })
  })
}

exports.like_product = function (req, res) {
  var _id = req.body.product_id;
  var user_id = req.decoded._id;
  if (!_id) {
    res.json({ success: false, message: "Product id not found" });
  }

  Freebies.findOneAndUpdate({ _id: _id }, { $push: { likelist: user_id } }, { new: true }, function (err, product) {
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
          /*if (user2.notification.push.user_visit_product)
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

  Freebies.findOneAndUpdate({ _id: _id }, { $pull: { likelist: user_id } }, { new: true }, function (err, product) {
    if (err)
      res.json({ success: false, error: err });
    else
      res.json({ success: true });
  });
}
exports.likelist = function (req, res) {
  var user_id = req.decoded._id;
  Freebies.find({ likelist: user_id }, (err, product) => {
    if (err)
      res.json({ success: false, error: err });
    else
      res.json({ success: true, data: { product, "productImageUrl": config.__image_url } });
  })
}
exports.boost_product = (req, res) => {
  var product_id = req.body.product_id;
  let curr_date = Math.floor(Date.now() / 1000);
  let no_of_days = req.body.no_of_day;
  if (!no_of_days)
    res.json({ success: false, message: "failed please contact admin" });
  let boosted_day = no_of_days * 24 * 60 * 60;
  let date = curr_date + boosted_day;
  if (!product_id) {
    res.json({ success: false, message: "Product_id not found" });
  } else {
    Freebies.findOneAndUpdate({ _id: product_id }, { boosted_at: curr_date, boosted_upto: date, boost: 1 }, { new: true }, function (err, product) {
      if (err)
        res.json({ success: false, error: err });
      else
        res.json({ success: true, message: 'Product boosted', data: product });
    });
  }
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
  data.product_type = "Commercial"

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
          notificationController.add_Notification(data)
        }
      });
    } else {
      console.log(`user notification_token not found ${user_id}`)
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
          url: config.__admin_url,
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
const FindBlockUser = async (userId) => {
  return await User.findOne({ _id: userId }).lean()
}

const property_filter = async (userId, doc, page, limit) => {
  try {
    let {
      category,
      latitude,
      longitude,
      distance,
      country,
      sortBy,
      unit,
      search_key
    } = doc
    if (search_key) {
      query = {
        $or: [
          { product_name: new RegExp(search_key, 'i') },
          { product_description: new RegExp(search_key, 'i') }
        ]
      }
    }
    const startIndex = (page - 1) * limit
    let no_of_day = 90; //3 month
    let min_price = doc.price[0].lower ? parseFloat(doc.price[0].lower) : 0;
    let max_price = doc.price[0].upper ? parseFloat(doc.price[0].upper) : 100000000;
    let curr_date = new Date().getTime();
    let minus = no_of_day * 24 * 60 * 60 * 1000;
    let date = new Date(curr_date - minus);
    let query = {}
    let query1 = {}, query2 = {}, query3 = {}

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

    // if (country)
    //   query.country = country
    if (category && category != 'All categories')
      query.category = category

    query.isBlock = false
    query.soldOut = false
    query.createdAt = { $gt: date }
    query.product_price = { $gte: min_price, $lte: max_price }

    if (userId) {
      let block_user = await FindBlockUser(userId)
      if (block_user)
        query.user_id = { $nin: block_user.block_user_id }
    }

    if (doc.category == "Property") {
      let furnishing = new RegExp(doc.furnishing ? doc.furnishing : ".*", 'i')
      // query.sub_category = { $elemMatch: { key: "furnishing", value: furnishing } }
      let construction_status = new RegExp(doc.construction_status ? doc.construction_status : ".*", 'i')
      //query1.sub_category = { $elemMatch: { key: "construction_status", value: construction_status } }
      let listed_by = new RegExp(doc.listed_by ? doc.listed_by : ".*", 'i')
      //query2.sub_category = { $elemMatch: { key: "listed_by", value: listed_by } }
      let car_parking = doc.car_parking ? doc.car_parking : 0
      // query.sub_category_number = { $elemMatch: { key: "car_parking", value: { $gte: car_parking } } }
      let min_super_builtup_area = doc.super_builtup_area ? doc.super_builtup_area[0].lower : 0
      let max_super_builtup_area = doc.super_builtup_area ? doc.super_builtup_area[0].upper : 100000000
      //query1.sub_category_number = { $elemMatch: { key: "super_builtup_area", value: { $gte: min_super_builtup_area, $lte: max_super_builtup_area } } }
      let maintenance = doc.maintenance ? doc.maintenance : 0
      //query2.sub_category_number = { $elemMatch: { key: "maintenance", value: { $gte: maintenance } } }
      let washrooms = doc.washrooms ? doc.washrooms : 0
      //query3.sub_category_number = { $elemMatch: { key: "washrooms", value: { $gte: washrooms } } }
      query1 = {
        $and: [
          { sub_category: { $elemMatch: { key: "furnishing", value: furnishing } } },
          { sub_category: { $elemMatch: { key: "construction_status", value: construction_status } } },
          { sub_category: { $elemMatch: { key: "listed_by", value: listed_by } } },
          { sub_category_number: { $elemMatch: { key: "car_parking", value: { $gte: car_parking } } } },
          { sub_category_number: { $elemMatch: { key: "super_builtup_area", value: { $gte: min_super_builtup_area, $lte: max_super_builtup_area } } } },
          { sub_category_number: { $elemMatch: { key: "maintenance", value: { $gte: maintenance } } } },
          { sub_category_number: { $elemMatch: { key: "washrooms", value: { $gte: washrooms } } } }
        ]
      }
    }
    let product
    switch (sortBy) {
      case "Distance": product = await Freebies.find(query).find(query1)
        .sort({
          dist: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      case "PriceAsc": product = await Freebies.find(query).find(query1)
        .sort({
          product_price: 1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      case "PriceDesc": product = await Freebies.find(query).find(query1)
        .sort({
          product_price: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      case "PublishRecent": product = await Freebies.find(query).find(query1)
        .sort({
          createdAt: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      default: product = await Freebies.find(query).find(query1)
        .sort({
          dist: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
    }
    const count = await Freebies.find(query).find(query1).count();

    console.log(product)
    return { product, count }
    //return product
  } catch (error) {
    console.log("error", error)
    throw error
  }

}

const van_filter = async (userId, doc, page, limit) => {
  try {
    let {
      category,
      latitude,
      longitude,
      distance,
      country,
      sortBy,
      unit,
      search_key
    } = doc

    const startIndex = (page - 1) * limit
    let no_of_day = 90;//3 month
    let min_price = doc.price[0].lower ? parseFloat(doc.price[0].lower) : 0;
    let max_price = doc.price[0].upper ? parseFloat(doc.price[0].upper) : 100000000;
    let min_year = doc.year ? parseInt(doc.year.lower) : 1900,
      max_year = doc.year ? parseInt(doc.year.upper) : 2050;
    let curr_date = new Date().getTime();
    let minus = no_of_day * 24 * 60 * 60 * 1000;
    let date = new Date(curr_date - minus);
    let query = {}
    let query1 = {}, query2 = {}, query3 = {}, query4 = {}
    if (search_key) {
      query = {
        $or: [
          { product_name: new RegExp(search_key, 'i') },
          { product_description: new RegExp(search_key, 'i') }
        ]
      }
    }
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

    // if (country)
    //   query.country = country
    if (category && category != 'All categories')
      query.category = category

    query.isBlock = false
    query.soldOut = false
    query.createdAt = { $gt: date }
    query.product_price = { $gte: min_price, $lte: max_price }

    if (userId) {
      let block_user = await FindBlockUser(userId)
      if (block_user)
        query.user_id = { $nin: block_user.block_user_id }
    }


    let make = new RegExp(doc.make ? doc.make : ".*", 'i')
    //query.sub_category = { $elemMatch: { key: "make", value: make } }
    let model = new RegExp(doc.model ? doc.model : ".*", 'i')
    //query1.sub_category = { $elemMatch: { key: "model", value: model } }
    let seller = new RegExp(doc.seller ? doc.seller : ".*", 'i')
    //query2.sub_category = { $elemMatch: { key: "seller", value: seller } }
    let transmission = new RegExp(doc.transmission ? doc.transmission : ".*", 'i')
    //query3.sub_category = { $elemMatch: { key: "transmission", value: transmission } }
    let trim = new RegExp(doc.trim ? doc.trim : ".*", 'i')
    //query4.sub_category = { $elemMatch: { key: "trim", value: trim } }
    let range = doc.range ? doc.range : 0
    //query.sub_category_number = { $elemMatch: { key: "range", value: { $gte: range } } }

    //query1.sub_category_number = { $elemMatch: { key: "year", value: { $gte: min_year, $lte: max_year } } }


    query1 = {
      $and: [
        { sub_category: { $elemMatch: { key: "make", value: make } } },
        { sub_category: { $elemMatch: { key: "model", value: model } } },
        { sub_category: { $elemMatch: { key: "seller", value: seller } } },
        { sub_category: { $elemMatch: { key: "transmission", value: transmission } } },
        { sub_category: { $elemMatch: { key: "trim", value: trim } } },
        { sub_category_number: { $elemMatch: { key: "range", value: { $gte: range } } } },
        { sub_category_number: { $elemMatch: { key: "year", value: { $gte: min_year, $lte: max_year } } } }
      ]
    }

    let product
    console.log(query1, query2, query3)
    switch (sortBy) {
      case "Distance": product = await Freebies.find(query).find(query1)
        //.find(query2).find(query3).find(query4)
        .sort({
          dist: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      case "PriceAsc": product = await Freebies.find(query).find(query1)
        //.find(query2).find(query3).find(query4)
        .sort({
          product_price: 1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      case "PriceDesc": product = await Freebies.find(query).find(query1)
        //.find(query2).find(query3).find(query4)
        .sort({
          product_price: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      case "PublishRecent": product = await Freebies.find(query).find(query1)
        //.find(query2).find(query3).find(query4)
        .sort({
          createdAt: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      default: product = await Freebies.find(query).find(query1)
        //.find(query2).find(query3).find(query4)
        .sort({
          dist: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
    }
    const count = await Freebies.find(query).find(query1).count();
    //.find(query2).find(query3).find(query4)
    return { product, count }
    // return product
  } catch (error) {
    console.log("err", error)
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
      search_key
    } = doc
    const startIndex = (page - 1) * limit
    let no_of_day = 90;//3 month
    let min_price = doc.price[0].lower ? parseFloat(doc.price[0].lower) : 0;
    let max_price = doc.price[0].upper ? parseFloat(doc.price[0].upper) : 100000000;
    let curr_date = new Date().getTime();
    let minus = no_of_day * 24 * 60 * 60 * 1000;
    let date = new Date(curr_date - minus);
    let query = {}
    const unit = doc.unit ? doc.unit : 'Miles';
    if (unit == 'Km' || unit == 'km')  //default is 500 mile
      distance = distance ? distance * 1000 : 804672
    else
      distance = distance ? distance * 1609 : 804672

    if (search_key) {
      query = {
        $or: [
          { product_name: new RegExp(search_key, 'i') },
          { product_description: new RegExp(search_key, 'i') }
        ]
      }
    }

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
    let product

    console.log("distance", distance)
    switch (sortBy) {
      case "Distance": product = await Freebies.find(query)
        .sort({
          dist: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      case "PriceAsc": product = await Freebies.find(query)
        .sort({
          product_price: 1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      case "PriceDesc": product = await Freebies.find(query)
        .sort({
          product_price: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      case "PublishRecent": product = await Freebies.find(query)
        .sort({
          createdAt: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
        break;
      default: product = await Freebies.find(query)
        .sort({
          dist: -1,
          boosted_upto: -1
        }).skip(startIndex).limit(limit)
    }
    const count = await Freebies.find(query).count();
    return { product, count }
  } catch (error) {
    console.log(error)
    throw error
  }

}


const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/csv/')
    },
    filename: function (req, file, cb) {
      cb(null, 'Commercial_' + Date.now() + parseInt(Math.random() * 100) + path.extname(file.originalname))


    }
  })
}).single("file");
exports.dummy_Commercial_add = function (req, res) {
  // res.json({ success: false, message: "Document Not Found" });
  upload(req, res, (err) => {
    if (err) {
      res.json({ success: false, message: "Document Not Found" });
    }
    const fs = require("fs");
    var csv = fs.readFileSync(req.file.path);
    var array = csv.toString().split("\r");
    let result = [];

    // The array[0] contains all the
    // header columns so we store them
    // in headers array
    let headers = array[0].split(", ")
    // Since headers are separated, we
    // need to traverse remaining n-1 rows.
    for (let i = 1; i < array.length - 1; i++) {
      let obj = {}
      let str = array[i]

      // Split the string using pipe delimiter |
      // and store the values in a properties array

      let properties = str.split("|")
      // For each header, if the value contains
      // multiple comma separated data, then we
      // store it in the form of array otherwise
      // directly the value is stored
      for (let j in headers) {
        let d2codeConvert = properties[j].split('"')
        let fynaleData = properties[j].split(d2codeConvert[1]).join("");
        let imgArr = [];
        if (d2codeConvert[5] && d2codeConvert[5].length > 0) {
          for (const iterator of d2codeConvert[5].split(',')) {
            imgArr.push(iterator)
          }
        }
        fynaleData = fynaleData.split(d2codeConvert[3]).join("");
        fynaleData = fynaleData.split(d2codeConvert[5]).join("");
        fynaleData = fynaleData.split(',""').join("");
        let data = fynaleData.split(",")
        let headersDtat = headers[0].split(",")
        obj = {
          [headersDtat[0]]: data[0] ? data[0].split('\n').join("") : '',
          geometry: {
            coordinates: [d2codeConvert[1] ? Number(d2codeConvert[1].split(',')[0]) : 0, d2codeConvert[1] ? Number(d2codeConvert[1].split(',')[1]) : 0],
            type: data[1] ? data[1] : ''
          },
          user_id: data[2] ? data[2] : '',
          product_type: data[3] ? data[3] : '',
          likelist: [],
          isBlock: data[4] === 'FALSE' || data[4] === 'false' ? false : true,
          soldOut: data[5] === 'FALSE' || data[5] === 'false' ? false : true,
          boosted_upto: data[6] ? Number(data[6]) : 0,
          boost: data[7] ? Number(data[7]) : 0,
          country: data[8] ? data[8] : '',
          address: d2codeConvert[3] ? d2codeConvert[3] : '',
          product_description: data[9] ? data[9] : '',
          seller_phone: data[10] ? data[10] : '',
          product_price: data[11] ? Number(data[11]) : 0,
          sub_category_number: [],
          sub_category: [],
          category: data[12] ? data[12] : '',
          product_name: data[13] ? data[13] : '',
          cover_thumb: data[14] ? data[14] : '',
          image: imgArr
        }
      }
      result.push(obj)
    }
    Freebies.insertMany(result).then(function () {
      res.json({ success: true, data: result, message: "Commercial's successfully created" });  // Success
    }).catch(function (error) {
      res.json({ success: false, message: error });      // Failure
    });
  });
};