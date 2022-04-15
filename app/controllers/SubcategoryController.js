const { SubcategoryModel,FavoriteModel } = require('../imports');
const constants = require("../imports").constants
let { successCallback } = require("../constants");
const http = require("https");

exports.allSubCategory = async (req, res, next) => {
    console.log(req.body.user_id)
    let subCategory= await SubcategoryModel.findAll({raw: true})
    if(subCategory.length){        
        let getSubValue = await FavoriteModel.findAll({where:{user_id:req.body.user_id},raw: true})
        for(let i=0;i<subCategory.length;i++){
            subCategory[i].value="0"
            if(getSubValue.length){
            for(let j=0;j<getSubValue.length;j++){
                if(getSubValue[j].subcategory_id==subCategory[i].id){
                    subCategory[i].value=getSubValue[i].value
                }
            }
        }
        }
        return res.json(constants.responseObj(true, 200, constants.messages.success, false, subCategory))
    }else{
        return res.json(constants.responseObj(false, 202, constants.messages.NoSubCategory))
    }
}
