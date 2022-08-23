const { UserSubcategoriesValueModel, SubcategoryModel, FavoriteModel } = require("../imports");
const constants = require("../imports").constants;
const { languageFunc } = require("../i18n/i18n");

exports.userFavorites = async (req, res, next) => {
  let i18n = languageFunc(req.language);
  const user_id = req.user_id;
  try {
    let subCategoryfav = await UserSubcategoriesValueModel.findAll({
      attributes: ["subcategory_id"],
      group: ["subcategory_id"],
      where: { user_id: user_id },
      raw: true
    });
    if (subCategoryfav.length) {
      let obj = [];
      for (let i = 0; i < subCategoryfav.length; i++) {
        obj.push(subCategoryfav[i].subcategory_id);
      }

      let subCategoryData = await UserSubcategoriesValueModel.findAll({
        raw: true,
        where: { user_id: user_id },
        order: [["created_at", "DESC"]],
        attributes: ["subcategory_id", "value"],
        include: [
          {
            model: SubcategoryModel,
            where: { id: obj }
          }
        ]
      });

      let subcategoryInfo = [];
      let subcategoryValueData = [];

      let subCategoryFavData = await FavoriteModel.findAll({
        attributes: ["subcategory_id"],
        group: ["subcategory_id"],
        where: { user_id: user_id },
        raw: true
      });
      subCategoryData.forEach(subcategorydata => {
        if (subcategoryValueData.includes(subcategorydata.subcategory_id)) {
        } else {
          subCategoryFavData.forEach(subcategoryfavdata => {
            if (subcategorydata["subcategory.id"] == subcategoryfavdata.subcategory_id) {
              isFavorite = true;
              subcategoryInfo.push({
                id: subcategorydata["subcategory.id"],
                name: subcategorydata["subcategory.name"],
                value: subcategorydata["value"],
                icon: subcategorydata["subcategory.icon"],
                unit: subcategorydata["subcategory.unit"],
                type: subcategorydata["subcategory.type"],
                category_id: subcategorydata["subcategory.category_id"],
                is_graph: subcategorydata["subcategory.is_graph"],
                is_favorite: isFavorite
              });
            }
          });
          subcategoryValueData.push(subcategorydata.subcategory_id);
        }
      });
      subcategoryInfo.sort(compare);
      return res.json(
        constants.responseObj(true, 201, i18n.__(`DataFound`), false, {
          subcategoryInfo
        })
      );
    } else {
      return res.json(constants.responseObj(false, 404, i18n.__(`NoDataFound`)));
    }
  } catch (error) {
    console.log(error, "error");
    return res.json(constants.responseObj(false, 500, i18n.__(`SomethingWentWrong`)));
  }
};

exports.addFavorites = async (req, res, next) => {
  let i18n = languageFunc(req.language);
  const user_id = req.user_id;
  FavoriteModel.destroy({
    where: {
      user_id: user_id
    }
  })
    .then(async result => {
      let favorite_data = req.body.subcategory_id;
      let subcategoryValue = [];
      if (favorite_data) {
        favorite_data.forEach(subcategory_id => {
          subcategoryValue.push({
            user_id: user_id,
            subcategory_id: subcategory_id
          });
        });
        const addFavorite = await FavoriteModel.bulkCreate(subcategoryValue);
        if (addFavorite) {
          return res.json(constants.responseObj(true, 201, i18n.__(`AddSuccess`), false));
        } else {
          return res.json(constants.responseObj(false, 500, i18n.__(`SomethingWentWrong`)));
        }
      } else {
        constants.responseObj(false, 500, i18n.__(`SomethingWentWrong`));
      }
    })
    .catch(err => {
      console.log("err:", err);
      constants.responseObj(false, 500, i18n.__(`SomethingWentWrong`));
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
