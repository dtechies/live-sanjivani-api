const {
  SubcategoryModel,
  UserSubcategoriesValueModel,
  jwt,
} = require("../imports");
const constants = require("../imports").constants;

exports.allSubCategory = async (req, res, next) => {
  const user_id = req.user_id;

  let subCategoryData = await UserSubcategoriesValueModel.findAll({
    raw: true,
    where: { user_id: user_id },
    order: [["created_at", "DESC"]],
    attributes: ["subcategory_id", "value"],
    include: [
      {
        model: SubcategoryModel,
      },
    ],
  });
  let subcategoryValueData = [];
  let dataN = [];
  if (subCategoryData) {
    subCategoryData.forEach((data) => {
      if (subcategoryValueData.includes(data.subcategory_id)) {
      } else {
        subcategoryValueData.push(data.subcategory_id);
        dataN.push({
          subcategory_id: data.subcategory_id,
          value: data.value,
          name: data["subcategory.name"],
          icon: data["subcategory.icon"],
          unit: data["subcategory.unit"],
          type: data["subcategory.type"],
          category_id: data["subcategory.category_id"],
        });
      }
    });
    let result = dataN.sort(compare);
    return res.json(
      constants.responseObj(
        true,
        200,
        constants.messages.Success,
        false,
        result
      )
    );
  } else {
    return res.json(
      constants.responseObj(false, 202, constants.messages.NoSubCategory)
    );
  }
};

exports.addSubCategoryValue = async (req, res, next) => {
  try {
    const user_id = req.user_id;
    let subcategory_value_data = req.body.subcategory_data;
    let subcategoryValue = [];
    if (subcategory_value_data) {
      subcategory_value_data.forEach((data) => {
        subcategoryValue.push({
          user_id: user_id,
          subcategory_id: data.subcategory_id,
          value: data.value,
          is_selected: 0,
        });
      });
      console.log(subcategoryValue, "subcategoryValue log");
      const addSubcategoryValue = await UserSubcategoriesValueModel.bulkCreate(
        subcategoryValue
      ).catch((err) => {
        constants.responseObj(
          false,
          500,
          constants.messages.SomethingWentWrong
        );
      });
      console.log(addSubcategoryValue, "addSubcategoryValue log");
      if (addSubcategoryValue) {
        return res.json(
          constants.responseObj(true, 201, constants.messages.AddSuccess, false)
        );
      } else {
        return res.json(
          constants.responseObj(
            false,
            500,
            constants.messages.SomethingWentWrong
          )
        );
      }
    } else {
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong);
    }
  } catch (err) {
    console.log("err:", err);
    return constants.responseObj(
      false,
      500,
      constants.messages.SomethingWentWrong
    );
  }
};
function compare(a, b) {
  if (Number(a.subcategory_id) < Number(b.subcategory_id)) {
    return -1;
  }
  if (Number(a.subcategory_id) > Number(b.subcategory_id)) {
    return 1;
  }
  return 0;
}
