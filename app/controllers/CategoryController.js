const { CategoryModel } = require('../imports');
const constants = require("../imports").constants
let { successCallback } = require("../constants");
const http = require("https");

exports.allCategory = async (req, res, next) => {
    let category= await CategoryModel.findAll()
    console.log(category)
    if(category.length){
        return res.json(constants.responseObj(true, 200, constants.messages.Success, false, category))
    }else{
        return res.json(constants.responseObj(false, 202, constants.messages.NoCategory))
    }
    
}
