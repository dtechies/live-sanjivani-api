const constants = require("../imports").constants;
require("dotenv").config();

let { jwt } = require("../imports/");

exports.PDFDownload = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.replace("Bearer ", "");
  const secretKey = process.env.SECRET_JWT || "theseissecret";
  const decoded = jwt.verify(token, secretKey);
  if (!decoded) {
    constants.responseObj(false, 500, constants.messages.SomethingWentWrong);
  }
};
