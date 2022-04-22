const { FavoriteModel,SubcategoryModel } = require('../imports');
const constants = require("../imports").constants
let { successCallback } = require("../constants");
const http = require("https");
let { jwt } = require("../imports/");
const sequelize = require('sequelize');

exports.userFavorites = async (req, res, next) => {
  
        const authHeader = req.headers.authorization;
        const token = authHeader.replace("Bearer ", "");
        const secretKey = process.env.SECRET_JWT || "theseissecret";
        const decoded = jwt.verify(token, secretKey)
        if(!decoded){
            constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
        }
        
       try{
         //let subCategoryDataa = await FavoriteModel.findAll( {attributes: [sequelize.fn("max", sequelize.col('id'))],group: ['subcategory_id'], where:{user_id:decoded.user_id,is_selected:1}})
         let subCategoryDataa = await FavoriteModel.findAll( {where:{user_id:decoded.user_id,is_selected:1},order: [['id', 'DESC']],limit:1})
         
        console.log(subCategoryDataa,"subCategoryDataa--------------")
       let subCategoryData =await FavoriteModel.findAll( {where:{user_id:decoded.user_id,is_selected:1},}, 
        { 
         include:[ {model : SubcategoryModel,where:{category_id:subCategoryDataa.category_id},
        }]
     });

    //     let subCategoryData = await SubcategoryModel.findAll(    
    //     { 
    //      include:[ {model : FavoriteModel,where:{user_id:decoded.user_id,is_selected:1},order: [['id', 'DESC']],attributes: ['value'],limit:1
    //     }]
    //  });
    return res.json(
      constants.responseObj(true, 201, constants.messages.DataFound, false, {
       subCategoryData,      
      })
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
    );
  }
};


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
