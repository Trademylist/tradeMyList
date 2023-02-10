'use strict';

var mongoose = require('mongoose'),
    FCM = require('fcm-node'),
    Notification = mongoose.model('Notification'),
    Product = mongoose.model('Product'),
    User = mongoose.model('Users'),
    config = require('../../config');


var ObjectID = require('mongodb').ObjectID;

exports.list = function (req, res) {
    let receiver_id = req.decoded._id
    let seen = req.query.seen
    if (!receiver_id)
        res.send({ success: false, message: "User Id  not found " });
    if (seen == undefined)
        Notification.find({ receiver_id: receiver_id }).sort({ createdAt: -1 }).then((notification) => {
            res.json({ success: true, data: notification });
        }).catch(err => {
            res.json({ success: false, error: err })
        })
    else
        Notification.find({ $and: [{ receiver_id: receiver_id }, { seen: seen }] }).sort({ createdAt: -1 }).then((notification) => {

            res.json({ success: true, data: notification });

        }).catch(err => {
            res.json({ success: false, error: err })
        })
}

exports.add_Notification = (data) => {
    let receiver_id = data.receiver_id
    if (!receiver_id)
        console.log({ success: false, message: "Receiver Id  not found " });
    var new_Notification = new Notification(data);
    new_Notification.save(function (err, notification) {
        if (err) {
            console.log(err)
        } else {
            console.log("Notification saved")
        }
    });

};


exports.read_a_Notification = function (req, res) {
    var _id = req.params.notification_id
    Notification.findById(_id, function (err, notification) {
        if (err)
            res.json({ success: false, error: err })

        res.json({ success: true, data: notification })
    });
};

exports.update_a_Notification = function (req, res) {
    var _id = req.body._id
    Notification.findOneAndUpdate({ _id: _id }, req.body, { new: true }, function (err, notification) {
        if (err)
            res.json({ success: false, error: err })
        else {
            res.json({ success: true, message: 'Notification updated successfully', data: notification })
        }
    });
};

exports.delete_a_Notification = function (req, res) {
    var _id = req.params.notification_id
    Notification.remove({ _id: _id }, function (err, notification) {
        if (err)
            res.json({ success: false, error: err })

        res.json({ success: true, message: 'Notification successfully deleted' })
    });
};

exports.delete_user_Notification = function (req, res) {
    var receiver_id = req.decoded._id
    Notification.remove({ receiver_id: receiver_id }, function (err, notification) {
        if (err)
            res.json({ success: false, error: err })

        res.json({ success: true, message: 'successfully deleted' })
    });
};