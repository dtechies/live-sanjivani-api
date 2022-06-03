const {
    LanguageModel
} = require('../imports');
const constants = require("../imports").constants
let {
    successCallback
} = require("../constants");
const http = require("https");

exports.allLanguage = async (req, res, next) => {
    let language = await LanguageModel.findAll()

    if (language.length) {
        return res.json(constants.responseObj(true, 200, constants.messages.success, false, language))
    } else {
        return res.json(constants.responseObj(false, 202, constants.messages.NoLanguage))
    }

}
