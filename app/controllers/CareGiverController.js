const { CareGiverModel } = require("../imports");
const constants = require("../imports").constants;
const dotenv = require("dotenv");
dotenv.config();
const { languageFunc } = require("../i18n/i18n");

exports.addCareGiver = async (req, res, next) => {
  let i18n = languageFunc(req.language);
  const user_id = req.user_id;
  try {
    let CareGiverData = {
      user_id: user_id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      contact_no: req.body.contact_no,
      email: req.body.email,
      address: req.body.address,
      nick_name: req.body.nick_name,
    };
    const CareGiver = await CareGiverModel.create(CareGiverData);
    if (CareGiver) {
      return res.json(constants.responseObj(true, 201, i18n.__(`AddSuccess`)));
    } else {
      return res.json(
        constants.responseObj(false, 500, i18n.__(`SomethingWentWrong`))
      );
    }
  } catch (error) {
    console.log(error, "error");
    return res.json(constants.responseObj(false, 500, error.parent));
  }
};

exports.caregiverData = async (req, res, next) => {
  let i18n = languageFunc(req.language);
  const user_id = req.user_id;
  let caregiverData = await CareGiverModel.findAll({
    where: { user_id: user_id },
  });
  if (caregiverData.length) {
    return res.json(
      constants.responseObj(
        true,
        200,
        i18n.__(`DataFound`),
        false,
        caregiverData
      )
    );
  } else {
    return res.json(
      constants.responseObj(false, 202, i18n.__(`NoCareGiverData`))
    );
  }
};

exports.deleteCareGiver = async (req, res, next) => {
  let i18n = languageFunc(req.language);
  const user_id = req.user_id;
  let caregiverData = await CareGiverModel.destroy({
    where: { id: req.body.id },
  });
  if (caregiverData) {
    return res.json(
      constants.responseObj(true, 200, i18n.__(`CareGiverDelete`), false, {})
    );
  } else {
    return res.json(
      constants.responseObj(false, 202, i18n.__(`NoCareGiverData`))
    );
  }
};
