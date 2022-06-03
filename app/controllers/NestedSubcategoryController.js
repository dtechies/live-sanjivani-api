const {
  NestedSubcategoryModel,
  SubcategoryModel
} = require("../imports");
const constants = require("../imports").constants;
let {
  successCallback
} = require("../constants");
const http = require("https");
let {
  jwt
} = require("../imports/");

exports.allnestedsubcategory = async (req, res, next) => {


  //  let subCategoryData = await SubcategoryModel.findAll(
  //     {
  //      include:[ {model : UserSubcategoriesValueModel,where:{user_id:decoded.user_id,is_selected:1},order: [['id', 'DESC']],attributes: ['value'],limit:1
  //     }]
  // })
  let nestedsubcategoryData = await SubcategoryModel.findAll({
    // where:{subcategory_id},
    include: [{
      model: NestedSubcategoryModel,

      order: [
        ["id", "DESC"]
      ],
    }, ],
  });
  if (nestedsubcategoryData) {
    return res.json(
      constants.responseObj(
        true,
        200,
        constants.messages.Success,
        false,
        nestedsubcategoryData
      )
    );
  } else {
    return res.json(
      constants.responseObj(false, 202, constants.messages.NoNestedSubcategory)
    );
  }
};
