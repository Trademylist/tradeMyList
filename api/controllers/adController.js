'use strict';

var mongoose = require('mongoose'),
    Ad = mongoose.model('Ad'),
    config = require('../../config');

var multer = require('multer');
const fs = require('fs');
const mime = require('mime');

exports.upload_image = function (req, res, next) {
    var upload = multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './uploads/adImages/')
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname.split('.')[0] + Date.now() + path.extname(file.originalname))

            }
        })
    })
    return upload.array('ad_image', 12)(req, res, next);
};

exports.add_ad = function (req, res) {
    var image = [];
    console.log(req.files);
    if (req.files) {
        req.files.forEach(function (val, index) {
            image.push(req.files[index].filename);
        })
        req.body.ad_image = image;
    }
    req.body.country = req.decoded.country;
    var new_ad = new Ad(req.body);
    new_ad.save(function (err, product) {
        if (err)
            res.json({ success: false, message: err });
        res.json({ success: true, data: product, message: 'Ad successfully created' });
    });
};

exports.get_all = function (req, res) {
    var ad_type = req.params.ad_type;
    var country = req.decoded.country;
    if (country && country[0] != null) {//normal admin 
        if (ad_type) {
            Ad.find({
                $and: [
                    { ad_category: ad_type },
                    { country: { $in: country }}
                ]
            }, function (err, ad) {
                if (err)
                    res.json({ success: false, error: err });
                res.json({ success: true, data: { ad, "adImageUrl": config.__adimage_url } });
            });
        } else {
            Ad.find({ country: { $in: country }}, function (err, ad) {
                if (err)
                    res.json({ success: false, error: err });
                res.json({ success: true, data: { ad, "adImageUrl": config.__adimage_url } });
            });
        }

    } else {//super admin
        if (ad_type) {
            Ad.find({ ad_category: ad_type }, function (err, ad) {
                if (err)
                    res.json({ success: false, error: err });
                res.json({ success: true, data: { ad, "adImageUrl": config.__adimage_url } });
            });
        } else {
            Ad.find(function (err, ad) {
                if (err)
                    res.json({ success: false, error: err });
                res.json({ success: true, data: { ad, "adImageUrl": config.__adimage_url } });
            });
        }
    }

};

exports.search_ad = function (req, res) {
    var svalue = req.body.search_value;
    console.log("serach key ", svalue);
    if (!svalue) {
        res.json({ success: false, message: 'search value required' });
    }
    const Regex = new RegExp(svalue, 'i');
    Ad.find({ ad_title: Regex }
        , function (err, ad) {
            if (err)
                res.json({ success: false, error: err });

            res.json({ success: true, data: ad });
        });
};

exports.update_ad = function (req, res) {
    var _id = req.body._id;
    if (!_id) {
        res.json({ success: false, message: "ad id not found" });
    }
    Ad.findOneAndUpdate({ _id: _id }, req.body, { new: true }, function (err, ad) {
        if (err)
            res.json({ success: false, error: err });
        else
            res.json({ success: true, message: 'Ad updated successfully', data: ad });
    });
};

exports.delete_ad = function (req, res) {
    var _id = req.params.ad_id;
    if (!_id) {
        res.json({ success: false, message: "ad_id not found" });
    }
    Ad.remove({ _id: _id }, function (err, ad) {
        if (err)
            res.json({ success: false, error: err });

        res.json({ success: true, message: 'Ad successfully deleted' });
    });
};

exports.add_Ad = function (req, res) {
    if (req.body.ad_type != 'AdMob') {// ad picture
        var matches = req.body.ad_image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};
    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    let decodedImg = response;
    let imageBuffer = decodedImg.data;
    let type = decodedImg.type;
    let extension = mime.extension(type);
    var raw = new Buffer.from(imageBuffer, 'base64')
    var filename = Math.floor(Math.random() * 100) + '_' + Date.now() + '.' + extension;
        require("fs").writeFile('./uploads/adImages/' + filename, raw, function (error) {
            if (!error) {
                req.body.ad_image = filename;
                req.body.country = req.decoded.country;
                var new_ad = new Ad(req.body);
                new_ad.save(function (err, product) {
                    if (err)
                        res.json({ success: false, message: err });
                    res.json({ success: true, data: product, message: 'Ad successfully created' });
                });
            } else {
                res.json({ success: false, message: error });
            }

        });
    }else{//google ad
        req.body.country = req.decoded.country;
        var new_ad = new Ad(req.body);
        new_ad.save(function (err, product) {
            if (err)
                res.json({ success: false, message: err });
            res.json({ success: true, data: product, message: 'Ad successfully created' });
        });
    }
};

exports.ad_count = function (req, res) {
    Ad.count(function (err, ad) {
        if (err)
            res.json({ success: false, error: err });
        res.json({ success: true, data: { name: 'Advertisement', path: 'advertisement', count: ad } });
    });
};
