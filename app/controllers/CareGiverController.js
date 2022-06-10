const { CareGiverModel } = require("../imports");
const constants = require("../imports").constants;
const dotenv = require("dotenv");
dotenv.config();

exports.addCareGiver = async (req, res, next) => {
  const user_id = req.user_id;
  try {
    let CareGiverData = {
      user_id: user_id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      contact_no: req.body.contact_no,
      email: req.body.email,
      nick_name: req.body.nick_name,
    };
    const CareGiver = await CareGiverModel.create(CareGiverData);
    if (CareGiver) {
      return res.json(
        constants.responseObj(true, 201, constants.messages.AddSuccess)
      );
    } else {
      return res.json(
        constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
      );
    }
  } catch (error) {
    console.log(error, "error");
    return res.json(constants.responseObj(false, 500, error.parent));
  }
};

exports.caregiverData = async (req, res, next) => {
  const user_id = req.user_id;
  let caregiverData = await CareGiverModel.findAll({
    where: { user_id: user_id },
  });
  if (caregiverData.length) {
    return res.json(
      constants.responseObj(
        true,
        200,
        constants.messages.DataFound,
        false,
        caregiverData
      )
    );
  } else {
    return res.json(
      constants.responseObj(false, 202, constants.messages.NoCareGiverData)
    );
  }
};

exports.deleteCareGiver = async (req, res, next) => {
  const user_id = req.user_id;
  let caregiverData = await CareGiverModel.destroy({
    where: { id: req.body.id },
  });
  if (caregiverData) {
    return res.json(
      constants.responseObj(
        true,
        200,
        constants.messages.CareGiverDelete,
        false,
        {}
      )
    );
  } else {
    return res.json(
      constants.responseObj(false, 202, constants.messages.NoCareGiverData)
    );
  }
};
