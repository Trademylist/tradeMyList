'use strict';

var mongoose = require('mongoose'),
    SecondOpinion = mongoose.model('SecondOpinion'),
    config = require('../../config');

exports.add = (req, res) => {
    req.body.sender_id=req.decoded._id;
    var new_opinion = new SecondOpinion(req.body);
    new_opinion.save(req.body, (err, data) =>{
        if (err)
            res.json({ success: false, message: err });
        res.json({ success: true, message: 'opinion send' });
    })
};
exports.list =(req ,res) =>{
    const product_id =req.body.product_id?req.body.product_id:null;
    if(product_id){
        res.json({ success: false, message: "Empty product_id" });
    }
    
};