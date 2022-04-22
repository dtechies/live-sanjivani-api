const { SubcategoryModel,FavoriteModel } = require('../imports');
const constants = require("../imports").constants
let { successCallback } = require("../constants");
const http = require("https");
let { jwt } = require("../imports/");

exports.allSubCategory = async (req, res, next) => {
 const authHeader = req.headers.authorization;
        const token = authHeader.replace("Bearer ", "");
        const secretKey = process.env.SECRET_JWT || "theseissecret";
        const decoded = jwt.verify(token, secretKey)
        if(!decoded){
            constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
        }

    console.log(req.body.user_id)
    let subCategory= await SubcategoryModel.findAll({raw: true})
    if(subCategory.length){        
        let getSubValue = await FavoriteModel.findAll({where:{user_id:decoded.user_id},raw: true})
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
        return res.json(constants.responseObj(true, 200, constants.messages.Success, false, subCategory))
    }else{
        return res.json(constants.responseObj(false, 202, constants.messages.NoSubCategory))
    }
}
