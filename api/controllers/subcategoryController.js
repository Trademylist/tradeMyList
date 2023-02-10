'use strict';
let mongoose = require('mongoose'),
  Subcategory = mongoose.model('Subcategory'),
  config = require('../../config');

exports.add = function (req, res) {
  let new_Subcategory = new Subcategory(req.body);
  new_Subcategory.save(function (err, data) {
    if (err) {
      res.json({ success: false, message: err });
    } else {

      res.json({ success: true, data: data, message: 'successfully created' });

    }
  });
};
exports.list = function (req, res) {
  let { name,
    type } = req.body;
    console.log(req.body)
  Subcategory.find({ $and: [{ name: name }, { type: type }] }, { division: 1 }, function (err, data) {
    if (err)
      res.json({ success: false, error: err });
    else
      res.json({ success: true, data: data });
  });
}

exports.all_list = async(req,res) => {
  let { name,
    type } = req.body;
    console.log(req.body)
  Subcategory.findOne({ $and: [{ name: name }, { type: type }] }, { division: 1 }, function (err, data) {
    if (err)
      res.json({ success: false, error: err });
    else
      res.json({ success: true, data: data });
  });
}

exports.deleteMake = async(req,res) => {
  let Id = req.query.Id;
  let { name, type } = req.body;
  try {
    let todo = await Subcategory.updateOne({_id: Id}, {$pull: { division: name }},{new: true});
        if(todo.nModified) {
          let findModel = await Subcategory.findOne({'name' : name , 'type' : type });
            for (const element of findModel.division) {
              await Subcategory.deleteOne({ 'name' : element , 'type' : type });
            };
            await Subcategory.deleteOne({ 'name' : name , 'type' : type });
          return res.json({ success: true, data:todo, message: 'successfully Deleted'})
        } else {
          return res.json({ success: false, message: 'Oops Somthing Wrong'})
        }
  } catch(err) {
    console.log(err);
    return res.json({ success: false, message: 'Oops Somthing Wrong'})
  }
}

exports.edit = async(req,res) => {
  let Id = req.query.Id;
  let makeId = req.query.makeId;
  let index = req.query.Index;
  let { name, type } = req.body;
  try {
    let MakeUpdate = await Subcategory.update(
      {_id : makeId},
      { $set: { [`division.${index}`]: name}}
    );
    if(Id != '') { 
      let findModel = await Subcategory.findById(Id);
      for (const element of findModel.division) {
        await Subcategory.deleteOne({ 'name' : element , 'type' : type });
      };
      await Subcategory.updateOne({_id:Id},{ $set: { "name" : name, "division": req.body.division } });
      for (const element of req.body.division) {
        let newTrim = new Subcategory({
          name: element,
          division:["others"],
          type: type
        });
        await newTrim.save();
      };
      return res.json({ success: true, message: 'successfully updated'});
    } else {
      let new_Subcategory = new Subcategory(req.body);
      let createModel = await new_Subcategory.save();
        for (const element of createModel.division) {
        let newTrim = new Subcategory({
          name: element,
          division:["others"],
          type: type
        });
        await newTrim.save();
      };
      return res.json({ success: true, data: createModel, message: 'successfully updated'});
    }
  } catch(err) {
    console.log(err);
    return res.json({ success: false, message: 'Oops Somthing Wrong'})
  }
}

exports.addMakewithModel = async(req, res) => {
  let makeId = req.query.makeId;
  let { name, type,division } = req.body;
  try {
    let update = await Subcategory.findOneAndUpdate(
      { _id: makeId }, 
      { $push: { division: name  } },
    );
    let new_Subcategory = new Subcategory(req.body);
    let createModel = await new_Subcategory.save();
      createModel.division.forEach(element => {
          let newTrim = new Subcategory({
            name: element,
            division:["others"],
            type: type
          });
          newTrim.save();
      });
      res.json({ success: true, message: 'successfully created' });
  } catch(err) {
    console.log(err);
    return res.json({ success: false, message: 'Oops Somthing Wrong'})
  }
};

exports.subCategoryName = async(req,res) => {
  try {
    let subCategory = await Subcategory.distinct("type");
    return res.json({ success: true, data: subCategory, message: 'Success'})
  } catch(err) {
    console.log(err);
    return res.json({ success: false, message: 'Oops Somthing Wrong'})
  }
}