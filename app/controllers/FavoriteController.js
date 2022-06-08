const {
  UserSubcategoriesValueModel,
  SubcategoryModel,
  FavoriteModel,
} = require("../imports");
const constants = require("../imports").constants;
let { successCallback } = require("../constants");
const http = require("https");
let { jwt } = require("../imports/");
const sequelize = require("sequelize");

exports.userFavorites = async (req, res, next) => {
  const user_id = req.user_id;
  try {
    let subCategoryfav = await UserSubcategoriesValueModel.findAll({
      attributes: ["subcategory_id"],
      group: ["subcategory_id"],
      where: { user_id: user_id },
      raw: true,
    });
    if (subCategoryfav.length) {
      let obj = [];
      for (let i = 0; i < subCategoryfav.length; i++) {
        obj.push(subCategoryfav[i].subcategory_id);
      }
      // let subCategoryData = await SubcategoryModel.findAll({
      //   where: { id: obj },
      // });
      let subCategoryData = await UserSubcategoriesValueModel.findAll({
        raw: true,
        where: { user_id: user_id },
        order: [["created_at", "DESC"]],
        attributes: ["subcategory_id", "value"],
        include: [
          {
            model: SubcategoryModel,
            where: { id: obj },
          },
        ],
      });
      let subCategoryDataN = [];
      let subcategoryValueData = [];

      let subCategoryFavData = await FavoriteModel.findAll({
        attributes: ["subcategory_id"],
        group: ["subcategory_id"],
        where: { user_id: user_id },
        raw: true,
      });
      subCategoryData.forEach((subcategorydata) => {
        let isFavorite = false;
        if (subcategoryValueData.includes(subcategorydata.subcategory_id)) {
        } else {
          subCategoryFavData.forEach((subcategoryfavdata) => {
            if (
              subcategorydata["subcategory.id"] ==
              subcategoryfavdata.subcategory_id
            ) {
              isFavorite = true;
            }
          });
          subcategoryValueData.push(subcategorydata.subcategory_id);
          subCategoryDataN.push({
            id: subcategorydata["subcategory.id"],
            name: subcategorydata["subcategory.name"],
            value: subcategorydata["value"],
            icon: subcategorydata["subcategory.icon"],
            unit: subcategorydata["subcategory.unit"],
            type: subcategorydata["subcategory.type"],
            category_id: subcategorydata["subcategory.category_id"],
            is_favorite: isFavorite,
          });
        }
      });
      subCategoryDataN.sort(compare);
      return res.json(
        constants.responseObj(true, 201, constants.messages.DataFound, false, {
          subCategoryDataN,
        })
      );
    } else {
      return res.json(
        constants.responseObj(false, 404, constants.messages.NoDataFound)
      );
    }
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
    );
  }
};

exports.addFavorites = async (req, res, next) => {
  const user_id = req.user_id;
  FavoriteModel.destroy({
    where: {
      user_id: user_id,
    },
  })
    .then(async (result) => {
      let favorite_data = req.body.subcategory_id;
      let subcategoryValue = [];
      if (favorite_data) {
        favorite_data.forEach((subcategory_id) => {
          subcategoryValue.push({
            user_id: user_id,
            subcategory_id: subcategory_id,
          });
        });
        const addFavorite = await FavoriteModel.bulkCreate(subcategoryValue);
        if (addFavorite) {
          return res.json(
            constants.responseObj(
              true,
              201,
              constants.messages.AddSuccess,
              false
            )
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
        constants.responseObj(
          false,
          500,
          constants.messages.SomethingWentWrong
        );
      }
    })
    .catch((err) => {
      console.log("err:", err);
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong);
    });
};

function compare(a, b) {
  if (Number(a.id) < Number(b.id)) {
    return -1;
  }
  if (Number(a.id) > Number(b.id)) {
    return 1;
  }
  return 0;
}
