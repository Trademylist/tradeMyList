'use strict';

var mongoose = require('mongoose'),
    FCM = require('fcm-node'),
    Review = mongoose.model('Review'),
    Product = mongoose.model('Product'),
    User = mongoose.model('Users'),
    Freebies = mongoose.model('Freebies'),
    nodemailer = require('nodemailer'),
    notificationController = require('./notificationController'),
    hbs = require('nodemailer-express-handlebars'),
    config = require('../../config');


var ObjectID = require('mongodb').ObjectID;
function pushNotification(user_id, notification_title, notification_message, click_action = "", sender_id = "", product_id = "", seller_id = "") {
    let data = {}
    data.receiver_id = user_id
    data.message = notification_message
    data.click_action = click_action
    data.sender_id = sender_id
    data.seller_id = seller_id
    data.product_id = product_id

    var serverKey = config.server_key;
    var fcm = new FCM(serverKey);

    User.findById(user_id, function (err, user) {
        if (err)
            console.log({ success: false, error: err, message: "Error in push notification" });
        if (user && user.notification_token) {
            let username = user.username ? user.username : "User"
            data.title = notification_title + username
            var message = {
                to: user.notification_token,
                collapse_key: 'your_collapse_key',
                notification: {
                    title: notification_title,
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
        secure: true,
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
            defaultLayout: 'review_template.hbs',
        }, viewPath: './api/templates', extName: '.hbs'
    }))
    User.findById(user_id, function (err, user) {
        if (err)
            console.log({ success: false, error: err, message: "Error in Mail notification" });
        else if (user && user.email) {
            var mailOptions = {
                from: config.email.fromName,
                to: user.email,
                subject: 'Trade Notification',
                template: 'review_template',
                context: {
                    name: user.username ? user.username : 'User',
                    message: notification_message,
                    url: `https://trademylist.com/seller/${sender_id}/${product_id}`,
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
exports.list = function (req, res) {
    let user_id = req.decoded._id
    if (!user_id)
        res.send({ success: false, message: "User Id  not found " });
    Review.find({ user_id: user_id }, (err, review) => {
        if (err)
            res.json({ success: false, error: err });
        res.json({ success: true, data: review });

    })
}

exports.add_review = function (req, res) {
    let user_id = req.body.user_id,
        product_id = req.body.product_id
    req.body.sender_id = req.decoded._id

    if (!user_id)
        res.send({ success: false, message: "User Id  not found " });
    User.findById(user_id, function (err, user) {
        if (err) {
            res.json({ success: false, message: "User not found" });
        }
        Review.find({ $and: [{ product_id: product_id }, { sender_id: req.decoded._id }, { user_id: user_id }] }, (err, data) => {
            if (err) {
                res.json({ success: false, message: err });
            }
            if (data.length > 0)
                res.json({ success: true, message: 'Multiple review is not allowed' })
            else {
                var new_review = new Review(req.body);
                new_review.save(function (err, review) {
                    if (err) {
                        res.json({ success: false, message: err });
                    } else {
                        if (user.notification.push.review)
                            pushNotification(user_id, "Hey ", `Your profile has been reviewed`, "review", req.decoded._id, product_id);
                        if (user.notification.email.review)
                            mail_notification(user_id, `Your profile has been reviewed .`, "review", req.decoded._id, product_id, "Review");
                        res.json({ success: true, data: review, message: 'Review successfully added' });
                    }
                });
            }
        })
    })

};
exports.check_review = function (req, res) {
    let product_id = req.body.product_id,
        sender_id = req.decoded._id
    Review.find({ $and: [{ product_id: product_id }, { sender_id: sender_id }] }, (err, data) => {
        if (err) {
            res.json({ success: false, message: err });
        }
        if (data.length > 0)
            res.json({ success: true, message: 'Multiple review is not allowed' })
        return;
    })
}

exports.seller_reveiw_details = function (req, res) {
    let user_id = req.body.user_id;
    User.findById(user_id, { username: 1, image: 1, email: 1, address: 1, login_type: 1 }, (err, user) => {
        if (err)
            res.json({ success: false, error: err });
        else {
            Product.find({ user_id: user_id }, (err1, product) => {
                if (err1)
                    res.json({ success: false, error: err1 });
                else {
                    Freebies.find({ user_id: user_id }, (err2, commercial) => {
                        if (err2)
                            res.json({ success: false, error: err2 });
                        else {
                            let _id = new ObjectID(user_id);
                            Review.aggregate([{ $match: { user_id: _id } },
                            {
                                $sort: { createdAt: -1 }
                            },
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
                                    sender_id: 1,
                                    product_id: 1,
                                    user_type: 1,
                                    description: 1,
                                    tags: 1,
                                    rating: 1,
                                    username: "$joindata.username",
                                    login_type: "$joindata.login_type",
                                    image: "$joindata.image"
                                }
                            }
                            ], (err2, review) => {
                                if (err2)
                                    res.json({ success: false, error: err2 });
                                else {
                                    let result = {},
                                        reviewObj = {}
                                        console.log(user)
                                    result._id = user._id
                                    result.email = user.email
                                    result.image = user.image
                                    result.username = user.username
                                    result.address = user.address
                                    result.login_type = user.login_type
                                    result.count = review.length
                                    let avg = 0, tags = [], reviewArray = []
                                    review.forEach(element => {
                                        avg += element.rating
                                        if (element.tags)
                                            tags = [...tags, ...element.tags]
                                    });
                                    var uniqs = tags.reduce((acc, val) => {
                                        acc[val] = acc[val] === undefined ? 1 : acc[val] += 1;
                                        return acc;
                                    }, {});
                                    result.avgRating = avg / review.length
                                    result.tags = uniqs
                                    result.imageUrl = config.__profile_image_url

                                    res.json({ success: true, data: { "user_details": result, "review_details": review, "seller_products": product, "seller_commercial": commercial, "product_imageUrl": config.__image_url } });
                                }
                            })
                        }
                    })
                }
            })

        }
    });
};

exports.read_a_review = function (req, res) {

    var _id = req.params.review_id;
    Review.findById(_id, function (err, review) {
        if (err)
            res.json({ success: false, error: err });

        res.json({ success: true, data: review });
    });
};

exports.update_a_review = function (req, res) {
    var _id = req.body._id;
    Review.findOneAndUpdate({ _id: _id }, req.body, { new: true }, function (err, review) {
        if (err)
            res.json({ success: false, error: err });
        else {
            res.json({ success: true, message: 'Review updated successfully', data: review });
        }
    });
};

exports.delete_a_review = function (req, res) {
    var _id = req.params.reviewId == undefined ? req.decoded._id : req.params.reviewId;
    Review.remove({ _id: _id }, function (err, review) {
        if (err)
            res.json({ success: false, error: err });

        res.json({ success: true, message: 'Review successfully deleted' });
    });
};

exports.get_rating = function (req, res) {
    let user_id = req.params.user_id;
    User.findById(user_id, { username: 1, image: 1, email: 1, address: 1, login_type: 1 }, (err, user) => {
        if (err)
            res.json({ success: false, error: err });
        else {
            Review.find({user_id:user_id}, (err2, review) => {
                if (err2)
                    res.json({ success: false, error: err2 });
                else {

                    let avg = 0
                    review.forEach(element => {
                        avg += element.rating

                    });
                    let data = {
                        username: user.username,
                        image: user.image,
                        avg_rating: avg / review.length,
                        count:review.length,
                        imageUrl: config.__profile_image_url
                    }
                    res.json({ success: true, data: data });
                }
            })
        }
    })
};

// function mailChecking() {

//     mail_notification("609a5c776cc5d17e2e7d91b0", `Testing mail`, `test`);

// }

//mailChecking()

