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
  try {
    let categoryData = await CategoryModel.findAll(
        { where:{id:req.body.category_id}, 
        include: [
          {
            model:SubcategoryModel,
            include:[ {model : FavoriteModel,order: [['id', 'DESC']],attributes: ['value'],limit:1
          }]
          }
        ],
        order: [['id', 'DESC']],
    });
    let abc = await invoicePdf(categoryData)
    console.log(abc)
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

