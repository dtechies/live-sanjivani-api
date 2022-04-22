const { FavoriteModel,SubcategoryModel } = require('../imports');
const constants = require("../imports").constants
let { successCallback } = require("../constants");
const http = require("https");

exports.userFavorites = async (req, res, next) => {
    let getSubValue = await FavoriteModel.findAll({where:{user_id:req.body.user_id,is_selected:1},raw: true})
    if(getSubValue.length){        
        let subCategory= await SubcategoryModel.findAll({raw: true})
        let arrObj = []
        if(subCategory.length){
        for(let i=0;i<subCategory.length;i++){
                for(let j=0;j<getSubValue.length;j++){                    
                    if(getSubValue[j].subcategory_id==subCategory[i].id){
                        subCategory[i].value=getSubValue[i].value
                        arrObj.push(subCategory[i])
                    }                
            }
        }
        return res.json(constants.responseObj(true, 200, constants.messages.Success, false, arrObj))
        }else{
            return res.json(constants.responseObj(false, 202, constants.messages.NoSubCategory))
        }   
    }else{
        return res.json(constants.responseObj(false, 202, constants.messages.NoFavorites))
    }
}

exports.addFavorites = async (req, res, next) => {
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
