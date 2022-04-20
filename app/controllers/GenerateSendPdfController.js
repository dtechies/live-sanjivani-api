const {
  CategoryModel,
  SubcategoryModel,
  
} = require("../imports");
const constants = require("../imports").constants;
const { S3 } = require("../imports");
const dotenv = require("dotenv");
let { jwt } = require("../imports/");
const sequelize = require('sequelize');
const db = require('../../app/models');


dotenv.config();

exports.getSubcategoryData = async (req, res, next) => {
  try {
 
    const CategoryData = await CategoryModel.findAll({where:{id:req.body.category_id}, 
        include: [SubcategoryModel],
        order: [['id', 'DESC']],
    });
    
    return res.json(
      constants.responseObj(true, 201, constants.messages.DataFound, false, {
        CategoryData,
      })
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
    );
  }
};




