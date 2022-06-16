const { NestedSubcategoryModel, SubcategoryModel } = require("../imports");
const constants = require("../imports").constants;
const { languageFunc } = require("../i18n/i18n");

exports.allnestedsubcategory = async (req, res, next) => {
  let i18n = languageFunc(req.language);
  let nestedsubcategoryData = await SubcategoryModel.findAll({
    // where:{subcategory_id},
    include: [
      {
        model: NestedSubcategoryModel,

        order: [["id", "DESC"]],
      },
    ],
  });
  if (nestedsubcategoryData) {
    return res.json(
      constants.responseObj(
        true,
        200,
        i18n.__(`success`),
        false,
        nestedsubcategoryData
      )
    );
  } else {
    return res.json(
      constants.responseObj(false, 202, i18n.__(`NoNestedSubcategory`))
    );
  }
};
