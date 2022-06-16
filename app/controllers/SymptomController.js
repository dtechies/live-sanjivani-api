const { SymptomModel } = require("../imports");
const constants = require("../imports").constants;
const { languageFunc } = require("../i18n/i18n");

exports.allSymptom = async (req, res, next) => {
  let i18n = languageFunc(req.language);
  let symptom = await SymptomModel.findAll();

  if (symptom.length) {
    return res.json(
      constants.responseObj(true, 200, i18n.__(`DataFound`), false, symptom)
    );
  } else {
    return res.json(constants.responseObj(false, 202, i18n.__(`NoSymptom`)));
  }
};
