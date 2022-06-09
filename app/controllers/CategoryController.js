const {
  CategoryModel,
  SubcategoryModel,
  UserSubcategoriesValueModel,
  NestedSubcategoryModel,
  OtherSubcategoryModel,
} = require("../imports");
const constants = require("../imports").constants;

exports.allCategory = async (req, res, next) => {
  let category = await CategoryModel.findAll();
  if (category.length) {
    return res.json(
      constants.responseObj(
        true,
        200,
        constants.messages.Success,
        false,
        category
      )
    );
  } else {
    return res.json(
      constants.responseObj(false, 202, constants.messages.NoCategory)
    );
  }
};

exports.allCatSubCategory = async (req, res, next) => {
  const user_id = req.user_id;
  try {
    let categoryData = await CategoryModel.findAll({
      include: [
        {
          model: SubcategoryModel,
          include: [
            {
              model: UserSubcategoriesValueModel,
              order: [["id", "DESC"]],
              attributes: ["value"],
              where: { user_id: user_id },
              limit: 1,
            },
            {
              model: NestedSubcategoryModel,
              order: [["id", "DESC"]],
              attributes: ["value"],
              where: { user_id: user_id },
              limit: 1,
            },
            {
              model: OtherSubcategoryModel,
              attributes: ["name", "unit"],
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });
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

exports.generatePdf = async (req, res, next) => {
  let category = await CategoryModel.findAll({
    raw: true,
  });
  if (category.length) {
    let subcategory = await SubcategoryModel.findAll({
      raw: true,
    });
    if (subcategory.length) {
      let favorites = await UserSubcategoriesValueModel.findAll({
        where: {
          user_id: req.body.user_id,
        },
        raw: true,
      });
      for (let i = 0; i < category.length; i++) {
        let arrObj = [];
        for (let j = 0; j < subcategory.length; j++) {
          subcategory[j].value = "0";
          if (favorites.length) {
            for (let k = 0; k < favorites.length; k++) {
              if (favorites[k].subcategory_id == subcategory[j].id) {
                subcategory[j].value = favorites[k].value;
              }
            }
          }
          if (category[i].id == subcategory[j].category_id) {
            arrObj.push(subcategory[j]);
          }
        }
        category[i].subcategory = arrObj;
      }
      return res.json(
        constants.responseObj(
          true,
          200,
          constants.messages.success,
          false,
          category
        )
      );
    } else {
      return res.json(
        constants.responseObj(false, 202, constants.messages.NoSubCategory)
      );
    }
  } else {
    return res.json(
      constants.responseObj(false, 202, constants.messages.NoCategory)
    );
  }
};

exports.addOtherScreenValues = async (req, res, next) => {
  try {
    const addSubcategoryValue = await NestedSubcategoryModel.bulkCreate(
      req.body
    ).then(async (value) => {
      return res.json(
        constants.responseObj(true, 201, constants.messages.AddSuccess)
      );
    });
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
    );
  }
};
