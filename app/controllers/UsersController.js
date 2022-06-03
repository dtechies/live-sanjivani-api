const {
  UsersModel
} = require("../imports");
const constants = require("../imports").constants;
let {
  jwt
} = require("../imports");
const dotenv = require("dotenv");
const {
  raw
} = require("express");
dotenv.config();
exports.registerUser = async (req, res, next) => {
  try {
    var random = Math.floor(1000 + Math.random() * 9000);
    let usersData = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      gender: req.body.gender,
      email: req.body.email,
      dob: req.body.dob,
      mob_no: req.body.mob_no,
      language: req.body.language,
      otp: random,
    };
    const addUser = await UsersModel.create(usersData);
    if (addUser) {
      const user = await UsersModel.findOne({
        where: {
          mob_no: req.body.mob_no
        }
      }, {
        raw: true
      });

      const secretKey = process.env.SECRET_JWT || "theseissecret";
      const token = jwt.sign({
          mob_no: user.mob_no,
          user_id: user.id
        },
        secretKey, {
          expiresIn: "24h",
        }
      );
      user.dataValues.token = token;
      return res.json(
        constants.responseObj(
          true,
          201,
          constants.messages.UserCreated,
          false,
          user
        )
      );
    } else {
      return res.json(
        constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
      );
    }
  } catch (error) {
    console.log(error, "error");
    return res.json(constants.responseObj(false, 500, error));
  }
};

exports.usersLogin = async (req, res, next) => {
  const mob_no = req.body.mob_no;
  const Otp = req.body.otp;
  let user = await UsersModel.findOne({
    where: {
      mob_no: mob_no
    }
  }, {
    raw: true
  });
  if (!user) {
    return res.json(
      constants.responseObj(false, 401, constants.messages.InvalidCredentials)
    );
  }
  if (user.otp == Otp) {
    const secretKey = process.env.SECRET_JWT || "theseissecret";
    const token = jwt.sign({
        mob_no: user.mob_no,
        user_id: user.id
      },
      secretKey, {
        expiresIn: "24h"
      }
    );
    user.dataValues.token = token;
    return res.json(
      constants.responseObj(true, 200, constants.messages.UserLogin, false, {
        user,
      })
    );
  } else {
    return res.json(
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
    );
  }
};
