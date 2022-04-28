const {
  CategoryModel,
  SubcategoryModel,
  FavoriteModel,
  
} = require("../imports");
const constants = require("../imports").constants;
const { S3 } = require("../imports");
const dotenv = require("dotenv");
let { jwt } = require("../imports/");
const sequelize = require('sequelize');
const db = require('../../app/models');
const {invoicePdf}=require('../utils/Utils')


dotenv.config();


exports.getSubcategoryData = async (req, res, next) => {
  const authHeader = req.headers.authorization;
        const token = authHeader.replace("Bearer ", "");
        const secretKey = process.env.SECRET_JWT || "theseissecret";
        const decoded = jwt.verify(token, secretKey)
        if(!decoded){
            constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
        }

       try{
         let subCategoryfav= await FavoriteModel.findAll( {attributes: ['subcategory_id'],group: ['subcategory_id'], where:{user_id:decoded.user_id,is_selected:1},raw:true })
         let obj=[]
         for(let i=0;i<subCategoryfav.length;i++){
            obj.push(subCategoryfav[i].subcategory_id)
         }
         console.log(obj)
         let categoryData = await CategoryModel.findAll(
          
        {  include: [
          {
          model:SubcategoryModel,where:{id:obj},
         include:[ {model : FavoriteModel,where:{user_id:decoded.user_id,is_selected:1},order: [['id', 'DESC']],attributes: ['value'],limit:1
        }]
         }
        ],
        order: [['id', 'DESC']],
     });
    let pdf = await invoicePdf(categoryData)
    return res.json(
      constants.responseObj(true, 201, constants.messages.DataFound, false, {
       categoryData,      
      })
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
    );
  }
};
