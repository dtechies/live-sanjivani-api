const { FavoriteModel } = require('../imports');
const constants = require("../imports").constants
let { successCallback } = require("../constants");
const http = require("https");

exports.userFavorites = async (req, res, next) => {
    let favorite= await FavoriteModel.findAll()
    console.log(favorite)
    if(favorite.length){
        return res.json(constants.responseObj(true, 200, constants.messages.success, false, favorite))
    }else{
        return res.json(constants.responseObj(false, 202, constants.messages.NoFavorites))
    }
}
exports.addFavorites = async (req, res, next) => {
    console.log(req.body)
     FavoriteModel.create({
                    user_id: req.body.user_id,
                    subcategory_id: req.body.subcategory_id,
                    value: req.body.value,
                    is_selected:req.body.is_selected,
                }).then(async(favorites)=>{
                    return res.json(constants.responseObj(true, 200, constants.messages.Success))

        }).catch((error) => {
                    console.log(error, "------>reult1");
                    return res.json(constants.responseObj(false, 409, constants.messages.SomethingWentWrong) )
                });
}
