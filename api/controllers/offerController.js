'use strict';

var mongoose = require('mongoose'),
    Offer = mongoose.model('Offer'),
    config = require('../../config');

var multer = require('multer');
const fs = require('fs');
const mime = require('mime');

//normal image upload
exports.upload_image = function (req, res, next) {
    var upload = multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './uploads/offerImages/')
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
    if (req.files) {
        req.files.forEach(function (val, index) {
            image.push(req.files[index].filename);
        })
        req.body.ad_image = image;
    }
    req.body.country = req.decoded.country;//add country according to token
    var new_offer = new Offer(req.body);
    new_offer.save(function (err, offer) {
        if (err)
            res.json({ success: false, message: err });
        res.json({ success: true, data: offer, message: 'offer successfully created' });
    });
};
//end code normal image upload

//base64 image Upload
exports.add_Ad = function (req, res) {
    var matches = req.body.offer_image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
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
    require("fs").writeFile('./uploads/offerImages/' + filename, raw, function (error) {
        if (!error) {
            req.body.user_id = req.decoded._id;
            req.body.offer_image = filename;
            req.body.country = req.decoded.country;//add country according to token
            var new_offer = new Offer(req.body);
            new_offer.save(function (err, offer) {
                if (err)
                    res.json({ success: false, message: err });
                res.json({ success: true, data: offer, message: 'Offer successfully created' });
            });
        } else {
            res.json({ success: false, message: error });
        }

    });

};

exports.get_admin_list = function (req, res) {
    var country = req.decoded.country;
    if (country && country[0] != null) {//normal admin
        Offer.find({ country: country }, function (err, offer) {
            if (err)
                res.json({ success: false, error: err });
            res.json({ success: true, data: { offer, "offerImageUrl": config.__offerimage_url } });
        });
    } else {//super admin
        Offer.find(function (err, offer) {
            if (err)
                res.json({ success: false, error: err });
            res.json({ success: true, data: { offer, "offerImageUrl": config.__offerimage_url } });
        });
    }

};

exports.get_user_list = function (req, res) {
    Offer.find({ owner_type: 'user' }, function (err, offer) {
        if (err)
            res.json({ success: false, error: err });
        res.json({ success: true, data: { offer, "offerImageUrl": config.__offerimage_url } });
    });
};

exports.search_offer = function (req, res) {
    var svalue = req.body.search_value;
    console.log(svalue);
    if (!svalue) {
        res.json({ success: false, message: 'search value required' });
    }
    const Regex = new RegExp(svalue, 'i');
    Offer.find({ offer_name: Regex, owner_type: "admin" }
        , function (err, offer) {
            if (err)
                res.json({ success: false, error: err });
            res.json({ success: true, data: offer });
        });
};

exports.search_offer_user = function (req, res) {
    var svalue = req.body.search_value;
    if (!svalue) {
        res.json({ success: false, message: 'search value required' });
    }
    const Regex = new RegExp(svalue, 'i');
    Offer.find({ offer_name: Regex, owner_type: "user" }
        , function (err, offer) {
            if (err)
                res.json({ success: false, error: err });

            res.json({ success: true, data: offer });
        });
};

exports.update_offer = function (req, res) {
    var _id = req.body._id;
    if (!_id) {
        res.json({ success: false, message: "Offer id not found" });
    }
    Offer.findOneAndUpdate({ _id: _id }, req.body, { new: true }, function (err, offer) {
        if (err)
            res.json({ success: false, error: err });
        else
            res.json({ success: true, message: 'Offer updated successfully', data: offer });
    });
};

exports.delete_offer = function (req, res) {
    var _id = req.params.offer_id;
    if (!_id) {
        res.json({ success: false, message: "offer_id not found" });
    }
    Offer.remove({ _id: _id }, function (err, offer) {
        console.log(offer);
        if (err)
            res.json({ success: false, error: err });

        res.json({ success: true, message: 'Offer successfully deleted' });
    });
};

exports.admin_count = function (req, res) {
    Offer.count({ owner_type: 'admin' }, function (err, cnt) {
        if (err)
            res.json({ success: false, error: err });
        res.json({ success: true, data: { name: 'Admin Offer', path: 'admin-offer-discount', count: cnt } });
    });
};

exports.seller_count = function (req, res) {
    Offer.count({ owner_type: 'user' }, function (err, cnt) {
        if (err)
            res.json({ success: false, error: err });
        res.json({ success: true, data: { name: 'Seller Offer', path: 'seller-offer-discount', count: cnt } });
    });
};

exports.nearBy = function (req, res) {
    var latitude = parseFloat(req.body.latitude);
    var longitude = parseFloat(req.body.longitude);
    console.log("lat long value ", latitude, " ", longitude);
    var distance = 10000000;
    if (!latitude || !longitude) {
        res.json({ success: false, message: 'location not found' });
    }
    Offer.aggregate([
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
        res.json({ success: true, data: { offer: result, "offerImageUrl": config.__offerimage_url } });

    }).catch();

};

exports.search_user_offer = function (req, res) {
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
    Offer.aggregate([
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
            $match: { offer_name: Regex }
        }
    ]).then(function (result) {
        res.json({ success: true, data: { offer: result, "offerImageUrl": config.__offerimage_url } });

    }).catch();
};

exports.search_user_offer_category = function (req, res) {
    var category = req.body.category;
    var latitude = parseFloat(req.body.latitude);
    var longitude = parseFloat(req.body.longitude);
    if (!category) {
        res.json({ success: false, message: 'category required' });
    }
    var distance = 10000000;
    if (!latitude || !longitude) {
        res.json({ success: false, message: 'location not found' });
    }
    Offer.aggregate([
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
            $match: { offer_category: category }
        }
    ]).then(function (result) {
        res.json({ success: true, data: { offer: result, "offerImageUrl": config.__offerimage_url } });

    }).catch();

};

exports.sample = function (req, res) {
    res.json({ success: true, data: {"reqfile":"----"+req.files,"reqbody":req.body} });
    
    // var latitude = parseFloat(req.body.latitude);
    // var longitude = parseFloat(req.body.longitude);
    // console.log("lat long value ", latitude, " ", longitude);
    // var distance = 10000000;
    // if (!latitude || !longitude) {
    //     res.json({ success: false, message: 'location not found' });
    // }
    // Offer.aggregate([{
    //     $lookup:
    //     {
    //         from: "categories",
    //         //localField: "offer_category",
    //         //foreignField: "category_name",
    //         pipeline: [{ $match: { "$expr": { "$in": ["$category_name":"$$offer_category"] } } },{}],
    //         as: "matches"
    //     }
    // }


        // {
        //     $geoNear: {
        //         near: {
        //             type: "Point",
        //             coordinates: [longitude, latitude]        // format [longitude, latitude]
        //         },
        //         distanceField: "dist.calculated",
        //         maxDistance: distance,
        //         spherical: true
        //     }
        // }
    // ]).then(function (result) {
    //     res.json({ success: true, data: { offer: result, "offerImageUrl": config.__offerimage_url } });

    // }).catch();

};