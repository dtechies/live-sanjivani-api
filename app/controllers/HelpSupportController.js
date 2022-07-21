const { HelpSupportModel } = require("../imports");
const constants = require("../imports").constants;
const { languageFunc } = require("../i18n/i18n");

exports.getHelpSupport = async (req, res, next) => {
  try {
    let i18n = languageFunc(req.language);
    const HelpSupportData = await HelpSupportModel.findAll();

    return res.json(
      constants.responseObj(true, 201, i18n.__(`DataFound`), false, {
        HelpSupportData,
      })
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, i18n.__(`SomethingWentWrong`))
    );
  }
};
exports.deleteHelpSupport = async (req, res, next) => {
  try {
    let i18n = languageFunc(req.language);
    const HelpSupportDelete = await HelpSupportModel.destroy({
      where: req.query,
    });
    if (HelpSupportDelete) {
      return res.json(
        constants.responseObj(true, 201, i18n.__(`DeleteSuccess`), false)
      );
    } else {
      return res.json(
        constants.responseObj(false, 500, i18n.__(`SomethingWentWrong`))
      );
    }
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, i18n.__(`SomethingWentWrong`))
    );
  }
};

exports.addHelpSupportData = async (req, res, next) => {
  try {
    let i18n = languageFunc(req.language);
    const HelpSupportData = await HelpSupportModel.create(req.body);
    if (HelpSupportData) {
      return res.json(
        constants.responseObj(true, 201, i18n.__(`AddSuccess`), false)
      );
    } else {
      return res.json(
        constants.responseObj(false, 500, i18n.__(`SomethingWentWrong`))
      );
    }
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, i18n.__(`SomethingWentWrong`))
    );
  }
};
