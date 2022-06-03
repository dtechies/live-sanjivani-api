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
const { checkUser } = require("../utils/Utils");

exports.userFavorites = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.replace("Bearer ", "");
  const secretKey = process.env.SECRET_JWT || "theseissecret";
  console.log(token, "token logg");
  const decoded = jwt.verify(token, secretKey);
  if (!decoded) {
    constants.responseObj(false, 500, constants.messages.SomethingWentWrong);
  }

  try {
    let subCategoryfav = await UserSubcategoriesValueModel.findAll({
      attributes: ["subcategory_id"],
      group: ["subcategory_id"],
      where: { user_id: decoded.user_id, is_selected: 1 },
      raw: true,
    });
    let obj = [];
    for (let i = 0; i < subCategoryfav.length; i++) {
      obj.push(subCategoryfav[i].subcategory_id);
    }
    console.log(obj);
    let subCategoryData = await SubcategoryModel.findAll({
      where: { id: obj },
      include: [
        {
          model: UserSubcategoriesValueModel,
          where: { user_id: decoded.user_id, is_selected: 1 },
          order: [["id", "DESC"]],
          attributes: ["value"],
          limit: 1,
        },
      ],
    });

    return res.json(
      constants.responseObj(true, 201, constants.messages.DataFound, false, {
        subCategoryData,
      })
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
    );
  }
};

exports.addFavorites = async (req, res, next) => {
  const user_id = await checkUser(req.headers.authorization);
  if (!user_id) {
    return res.json(
      constants.responseObj(false, 401, constants.messages.Unauthorized)
    );
  }
  console.log(user_id, "user_id logg");
  let favorite_data = req.body.subcategory_id;
  let subcategoryValue = [];
  if (favorite_data) {
    favorite_data.forEach((subcategory_id) => {
      subcategoryValue.push({
        user_id: user_id,
        subcategory_id: subcategory_id,
      });
    });
    console.log(subcategoryValue, "subcategoryValue log");
    const addFavorite = await FavoriteModel.bulkCreate(subcategoryValue);
    console.log(addFavorite, "addFavorite log");
    if (addFavorite) {
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
