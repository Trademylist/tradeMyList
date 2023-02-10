var squareConnect = require('square-connect'),
  express = require('express'),
  crypto = require('crypto'),
  app = express(),
  fs = require('fs'),
  https = require('https'),
  mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'), 
  nodemailer = require('nodemailer'),
  bodyParser = require('body-parser'),
  multer = require('multer'),
  path = require('path'),
  hbs = require('nodemailer-express-handlebars');
// var fileupload = require("express-fileupload");
// app.use(fileupload());


path = require('path'),
  config = require('./config'),
  /* CREATED MODEL LOADING HERE */
  Product = require('./api/models/productModel'),
  User = require('./api/models/userModel'),
  Vacancies = require('./api/models/vacanciesModel'),
  Freebies = require('./api/models/freebiesModel'),
  Cms = require('./api/models/cmsModel'),
  Ad = require('./api/models/adModel'),
  Offer = require('./api/models/offerModel'),
  Category = require('./api/models/categoryModel'),
  Share = require('./api/models/shareModel'),
  Suggest = require('./api/models/suggestModel'),
  Review = require('./api/models/reviewModel'),
  Subcategory = require('./api/models/subcategoryModel'),
  Currencies = require('./api/models/currenciesModel')
Report = require('./api/models/reportModel'),
  notification = require('./api/models/notificationModel'),
  ContantUs = require('./api/models/contactUsModel'),
  ChatBlock = require('./api/models/chatBlockModel'),  
  comment = require('./api/models/commentModel'),
  paymentInfo = require('./api/models/paymentInfoModel'),
  defaultData = require('./api/models/defaultDataModel'),
  amountInfo = require('./api/models/amountInfoModel');



/* MONGO DATABASE CONNECTION */
mongoose.Promise = require('bluebird');
var options = { useMongoClient: true };
var connectionString = "mongodb://" + config.database.username + ":" + config.database.password + "@" + config.database.host + ":" + config.database.port + "/" + config.database.dbName + "?authSource=" + config.database.authDb
mongoose.connect(connectionString, options);

// Connected handler
mongoose.connection.on('connected', function (err) {
  console.log("Connected to DB using chain: " + config.database.dbName);
});

// Error handler
mongoose.connection.on('error', function (err) {
  console.log("MongoDB Error: ", err);
});

//mongoose.Promise = global.Promise;
//mongoose.connect(config.database, { useMongoClient: true });

/* URL PERSING */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(function(req, res) {
//   res.status(404).send({url: req.originalUrl + ' not found'})
// });


/* STATIC FOLDER ACCESS FOR IMAGE */
app.use(express.static('assets'));
app.use(express.static('uploads'));


/* ACCESS TOKEN VERIFICATON */
app.use(function (req, res, next) {
  console.log(config.__site_url + req.url);
  //console.log (req.body,"+++++",req.headers);
  if (
    req.url == '/'
    || (req.url.search("/get_cms") != -1)
    || req.url == '/login'
    || req.url == '/app/login'
    || req.url == '/app/social_login'
    || req.url == '/app/contact_login'
    || req.url == '/app/review'
    || req.url == '/forgot_password'
    || req.url == '/currency'
    || (req.url.search("/emailvalidate") != -1)
    || (req.url.search("/email_change") != -1)
    || req.url == '/app/registration'
    || req.url == '/app/forgot_password'
    || req.url == '/is_valid_token'
    || req.url == '/generate_token'
    || req.url == 'app_seller/uploadtest'
    || (req.url.search("/app_user/") != -1)
  ) {
    next();
  } else {
    var token = req.body.token || req.params.token || req.headers['x-access-token'] ||req.query.token;
    if (token) {
      jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
          res.status(403).send({ success: false, message: "failed to authenticate" });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else if (req.method != 'OPTIONS') {
      res.status(403).send({ success: false, message: "token required" });
    } else {
      next();
    }
  }

});

/* CROS DOMAIN SETUP */
app.use(function (req, res, next) {

  /* Website you wish to allow to connect */
  res.setHeader('Access-Control-Allow-Origin', '*');

  /* Request methods you wish to allow */
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE, x-http-method-override');

  /* Request headers you wish to allow */
  res.setHeader('Access-Control-Allow-Headers', ' Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token');

  /* Set to true if you need the website to include cookies in the requests sent to the API (e.g. in case you use sessions) */
  res.setHeader('Access-Control-Allow-Credentials', true);

  //modification
  res.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");

  /* Pass to next layer of middleware */
  next();
});

/* VIEW ENGINE SETUP */
app.set('views', path.join(__dirname, 'api/views'));
app.set('view engine', 'ejs');
var index = require('./api/routes/index');
app.use('/', index);


app.get('/dashboard', function (req, res, next) {
  Product.count(function (err, prod) {

    Cms.count(function (err, cms) {
      Freebies.count(function (err, free) {
        Offer.count({ owner_type: 'admin' }, function (err, admin_of) {
          Offer.count({ owner_type: 'user' }, function (err, seller_of) {
            User.count({ role: 'user' }, function (err, user) {
              User.count({ role: 'admin' }, function (err, admin) {
                Vacancies.count(function (err, vac) {
                  res.json({
                    success: true,
                    data: [
                      { name: 'Admin', path: 'admin', count: admin },
                      { name: 'Seller', path: 'seller', count: user },
                      { name: 'Product', path: 'product', count: prod },
                      { name: 'Commercial', path: 'freebies', count: free },
                      // { name: 'Admin Offer', path: 'admin-offer-discount', count: admin_of },
                      // { name: 'Seller Offer', path: 'seller-offer-discount', count: seller_of },
                      // { name: 'Vacancies', path: 'vacancies', count: vac },
                      { name: 'Cms', path: 'cms', count: cms }
                    ]
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

app.get('/all_country', function (req, res, next) {
  res.json({ success: true, data: config.countryList });
});

//----------multer upload
/*
var chat_upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/chatMedia/')
    },
    filename: function (req, file, cb) {
      cb(null, 'chat_' + Date.now() + path.extname(file.originalname))

    }
  })
})
var chat_type = chat_upload.array('file', 1); // can use for multiple upload too

app.post('/chat_media_upload', chat_type, function (req, res) {
  var image = [];
  req.files.forEach(function (val, index) {
    image.push(req.files[index].filename);
  })

  res.json({ success: true, message: "Success", data: config.__site_url + '/chatMedia/' + image[0] });
});*/

//product and commercial upload 
var product_upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/productImages/')
    },
    filename: function (req, file, cb) {
      cb(null, 'product_' + Date.now() + parseInt(Math.random() * 100) + path.extname(file.originalname))

    }
  })
})
var product_type = product_upload.array('file', 1); // can use for multiple upload too

/*app.post('/app_seller/upload', product_type, function (req, res) {
  var image = [];
  req.files.forEach(function (val, index) {
    image.push(req.files[index].filename);
  })

  res.json({ success: true, message: "Success", data: { image: image[0], path: config.__image_url } });
});*/
//profile upload
/*
var profile_upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/profileImages/')
    },
    filename: function (req, file, cb) {
      cb(null, 'profile' + Date.now() + parseInt(Math.random() * 100) + path.extname(file.originalname))

    }
  })
})
var profile_type = profile_upload.array('file', 1); // can use for multiple upload too

app.post('/app_seller/profileupload', profile_type, function (req, res) {
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
});*/
//---------------end multer upload

app.use(express.static(__dirname));

//cron start
var cron = require('node-cron');

cron.schedule('0 50 19 * * *', () => { //at 19:50 server time
  console.log('**************** Cron Job ********************');
  const product = require('./api/controllers/productController');
  product.check_expire_product();
  product.check_boosted_product();
})
//cron end


/* IMPORTING ROUTE */
var routes = require('./api/routes/routes');

/* REGISTER THE ROUTE */
routes(app);


/* RUN THE SERVICE */
https.createServer({
  key: fs.readFileSync(config.__key),
  cert: fs.readFileSync(config.__cert),
  ca: fs.readFileSync(config.__bundle)
}, app)
  .listen(config.port);


/* RUN THE SERVICE */
//app.listen(config.port);


console.log('Trade RESTful API server started on: ' + config.port);