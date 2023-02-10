'use strict';

var mongoose = require('mongoose'),
    Share = mongoose.model('Share'),
    Product = mongoose.model('Product'),
    config = require('../../config');


exports.list = function (req, res) {
    Share.aggregate([{
        $match: { user_id: req.decoded._id }
    }, {
        $lookup: {
            from: 'products',
            localField: 'product_id',
            foreignField: '_id',
            as: 'joindata'
        }
    }
    ]).exec(function (err, data) {
        if (err)
            res.json({ success: false, error: err });
        res.json({ success: true, data: { data, "productImageUrl": config.__image_url } });
    });
};

exports.add = function (req, res) {
    if (req.decoded._id && req.body.product_id) {
        const user_id = req.decoded._id;
        const product_id = req.body.product_id;
        Share.find({
            $and:
                [
                    { user_id: user_id },
                    { product_id: product_id }
                ]
        }, (err, sharedata) => {
            if (err) {
                res.json({ success: false, message: err });
            }
            if (sharedata.length > 0) {
                res.json({ success: false, message: 'Already shared' });
            } else {
                req.body.user_id = user_id;
                var new_share = new Share(req.body);
                new_share.save(function (err, data) {
                    if (err)
                        res.json({ success: false, message: err });
                    else
                        res.json({ success: true, data: data });
                });
            }
        })
    } else {
        res.json({ success: false, message: "Invalid data" });
    }

};
exports.delete = function (req, res) {
    var _id = req.params.share_id;
    if (!_id) {
        res.json({ success: false, message: 'id not found' });
    }
    Share.remove({ _id: _id }, function (err, data) {
        if (err)
            res.json({ success: false, error: err });
        res.json({ success: true, message: 'Deleted' });
    });
};
