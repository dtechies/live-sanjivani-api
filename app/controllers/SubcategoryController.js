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
  console.log(req.headers.authorization, "authorization");
  const user_id = await checkUser(req.headers.authorization);
  if (!user_id) {
    return res.json(
      constants.responseObj(false, 401, constants.messages.Unauthorized)
    );
  }
  console.log(user_id, "user_id logg");
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
    console.log(subcategoryValue, "subcategoryValue log");
    const addSubcategoryValue = await UserSubcategoriesValueModel.bulkCreate(
      subcategoryValue
    );
    console.log(addSubcategoryValue, "addSubcategoryValue log");
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
