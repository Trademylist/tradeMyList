'use strict';

var mongoose = require('mongoose'),
    Category = mongoose.model('Category');
var multer = require('multer');
const fs = require('fs');
const mime = require('mime');
var upload = multer({ storage: multer.memoryStorage({}) })

exports.all_category = function (req, res) {
    Category.find(function (err, category) {
        if (err)
            res.json({ success: false, error: err });

        res.json({ success: true, data: { category, "categoryImageUrl": config.__categoryimage_url } });
    });
};
exports.category_list = function (req, res) {
    var category_type = req.params.category_type;
    Category.find({ category_type: category_type }, function (err, category) {
        if (err)
            res.json({ success: false, error: err });

        res.json({ success: true, data: { category, "categoryImageUrl": config.__categoryimage_url } });
    });
};

exports.add_category = function (req, res) {
    //upload.single('test');
    var matches = req.body.category_image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
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
    var filename = Math.floor(Math.random() * 100) + '_' + Date.now() +'.'+ extension;
    fs.writeFile('./uploads/categoryImages/' + filename, raw, function (error) {
        if (!error) {
            req.body.category_image = filename;
            var new_category = new Category(req.body);
            new_category.save(function (err, category) {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    res.json({ success: true, data: category, message: 'Category successfully created' });
                }
            });
        } else {
            res.json({ success: false, message: error });
        }
    })
}

exports.update_a_category = function (req, res) {
    var _id = req.body._id;
    Category.findOneAndUpdate({ _id: _id }, req.body, { new: true }, function (err, category) {
        if (err)
            res.json({ success: false, error: err });
        else {
            res.json({ success: true, message: 'Category updated successfully', data: category });
        }
    });
};

exports.delete_a_category = function (req, res) {
    var _id = req.params.category_id;
    Category.remove({ _id: _id }, function (err, category) {
        if (err)
            res.json({ success: false, error: err });

        res.json({ success: true, message: 'Category successfully deleted' });
    });
};
exports.count = function (req, res) {
    Category.count(function (err, cnt) {
        if (err)
            res.json({ success: false, error: err });
        res.json({ success: true, data: { name: 'Category', path: 'category', count: cnt } });
    });
};
exports.user_category_list = function (req, res) {
    var category_type = req.params.category_type;
    Category.find({$and:[
        { category_type: category_type },
        {isBlock: false}
    ]
}, function (err, category) {
        if (err)
            res.json({ success: false, error: err });

        res.json({ success: true, data: { category, "categoryImageUrl": config.__categoryimage_url } });
    });
};