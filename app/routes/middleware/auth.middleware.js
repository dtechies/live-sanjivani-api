const { UsersModel } = require("../../models");
const constants = require("../../constants");
let { jwt } = require("../../imports");
const dotenv = require("dotenv");
dotenv.config();
const auth = () => {
  return async function (req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      const bearer = "Bearer ";
      if (!authHeader || !authHeader.startsWith(bearer)) {
        return res.json(
          constants.responseObj(false, 401, constants.messages.AccessDenied)
        );
      }

      const token = authHeader.replace(bearer, "");
      const secretKey = process.env.SECRET_JWT || "theseissecret";

      // Verify Token
      const decoded = jwt.verify(token, secretKey);
      const user = await UsersModel.findOne({
        where: { mob_no: decoded.mob_no },
      });
      if (!user) {
        return res.json(
          constants.responseObj(false, 401, constants.messages.Authorization)
        );
      }
      req.currentUser = user;
      req.user_id = user.id;
      req.language = user.language == "english" ? "en" : "hi";
      next();
    } catch (e) {
      return res.json(
        constants.responseObj(false, 401, constants.messages.InvalidToken)
      );
    }
  };
};

module.exports = auth;
