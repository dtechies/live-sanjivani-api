const { SubcategoryModel } = require('../imports');
const constants = require("../imports").constants
let { successCallback } = require("../constants");
const http = require("https");

exports.allSubCategory = async (req, res, next) => {
    let subCategory= await SubcategoryModel.findAll()
    console.log(subCategory)
    if(subCategory.length){
        return res.json(constants.responseObj(true, 200, constants.messages.success, false, subCategory))
    }else{
        return res.json(constants.responseObj(false, 202, constants.messages.NoSubCategory))
    }
    
}
