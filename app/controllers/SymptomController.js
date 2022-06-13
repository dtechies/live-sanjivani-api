const { SymptomModel } = require("../imports");
const constants = require("../imports").constants;
let { successCallback } = require("../constants");
const http = require("https");

exports.allSymptom = async (req, res, next) => {
  let symptom = await SymptomModel.findAll();

  if (symptom.length) {
    return res.json(
      constants.responseObj(
        true,
        200,
        constants.messages.DataFound,
        false,
        symptom
      )
    );
  } else {
    return res.json(
      constants.responseObj(false, 202, constants.messages.NoSymptom)
    );
  }
};
