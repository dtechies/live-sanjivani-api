const {
  HelpSupportModel
} = require('../imports');
const constants = require("../imports").constants

exports.getHelpSupport = async (req, res, next) => {
  try {

    const HelpSupportData = await HelpSupportModel.findAll();

    return res.json(
      constants.responseObj(true, 201, constants.messages.DataFound, false, {
        HelpSupportData,
      })
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
    );
  }
};
