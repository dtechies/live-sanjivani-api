const {
  SubcategoryModel,
  UserSubcategoriesValueModel,
  jwt,
} = require("../imports");
const constants = require("../imports").constants;
const {
  checkUser
} = require("../utils/Utils");

exports.allSubCategory = async (req, res, next) => {
  const user_id = req.user_id;

  let subCategoryData = await SubcategoryModel.findAll({
    include: [{
      model: UserSubcategoriesValueModel,
      where: {
        user_id: user_id,
        is_selected: 1
      },
      order: [
        ["id", "DESC"]
      ],
      attributes: ["value"],
      limit: 1,
    }, ],
  });
  if (subCategoryData) {
    return res.json(
      constants.responseObj(
        true,
        200,
        constants.messages.Success,
        false,
        subCategoryData
      )
    );
  } else {
    return res.json(
      constants.responseObj(false, 202, constants.messages.NoSubCategory)
    );
  }
};

exports.addSubCategoryValue = async (req, res, next) => {
  const user_id = await checkUser(req.headers.authorization);
  if (!user_id) {
    return res.json(
      constants.responseObj(false, 401, constants.messages.Unauthorized)
    );
  }
  let subcategory_value_data = req.body.subcategory_data;
  let subcategoryValue = [];
  if (subcategory_value_data) {
    subcategory_value_data.forEach((data) => {
      subcategoryValue.push({
        user_id: user_id,
        subcategory_id: data.subcategory_id,
        value: data.subcategory_id,
        is_selected: 0,
      });
    });
    const addSubcategoryValue = await UserSubcategoriesValueModel.bulkCreate(
      subcategoryValue
    );
    if (addSubcategoryValue) {
      return res.json(
        constants.responseObj(true, 201, constants.messages.AddSuccess, false)
      );
    } else {
      return res.json(
        constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
      );
    }
  } else {
    constants.responseObj(false, 500, constants.messages.SomethingWentWrong);
  }
};
