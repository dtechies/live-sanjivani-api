const { SubcategoryModel, FavoriteModel, jwt } = require("../imports");
const constants = require("../imports").constants;

exports.allSubCategory = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.replace("Bearer ", "");
  const secretKey = process.env.SECRET_JWT || "theseissecret";
  const decoded = jwt.verify(token, secretKey);
  if (!decoded) {
    constants.responseObj(false, 500, constants.messages.SomethingWentWrong);
  }

  let subCategoryData = await SubcategoryModel.findAll({
    include: [
      {
        model: FavoriteModel,
        where: { user_id: decoded.user_id, is_selected: 1 },
        order: [["id", "DESC"]],
        attributes: ["value"],
        limit: 1,
      },
    ],
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
