const { LanguageModel } = require("../imports");
const constants = require("../imports").constants;
const { languageFunc } = require("../i18n/i18n");

exports.allLanguage = async (req, res, next) => {
  let language = await LanguageModel.findAll();
  let i18n = languageFunc(req.language);

  if (language.length) {
    return res.json(
      constants.responseObj(true, 200, i18n.__(`success`), false, language)
    );
  } else {
    return res.json(constants.responseObj(false, 202, i18n.__(`NoLanguage`)));
  }
};
