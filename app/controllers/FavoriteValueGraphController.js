const { UserSubcategoriesValueModel, SubcategoryModel } = require("../imports");
const constants = require("../imports").constants;
let { successCallback } = require("../constants");
const http = require("https");
let { jwt } = require("../imports/");
const sequelize = require("sequelize");

exports.userFavoritesGraph = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.replace("Bearer ", "");
  const secretKey = process.env.SECRET_JWT || "theseissecret";
  const decoded = jwt.verify(token, secretKey);
  if (!decoded) {
    constants.responseObj(false, 500, constants.messages.SomethingWentWrong);
  }
  try {
    let subCategoryfav = await UserSubcategoriesValueModel.findAll({
      where: {
        user_id: decoded.user_id,
        subcategory_id: req.body.subcategory_id,
        is_selected: 1,
      },
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
          attributes: ["value", "created_at", "updated_at"],
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
