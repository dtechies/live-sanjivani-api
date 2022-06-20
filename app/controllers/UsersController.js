const { UsersModel } = require("../imports");
const constants = require("../imports").constants;
let { jwt } = require("../imports");
const dotenv = require("dotenv");
const { raw } = require("express");
dotenv.config();
const { languageFunc } = require("../i18n/i18n");

exports.registerUser = async (req, res, next) => {
  try {
    let i18n = languageFunc(req.language);
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
      country_code: req.body.country_code,
    };
    const addUser = await UsersModel.create(usersData);
    if (addUser) {
      const user = await UsersModel.findOne(
        {
          where: {
            mob_no: req.body.mob_no,
          },
        },
        {
          raw: true,
        }
      );

      const secretKey = process.env.SECRET_JWT || "theseissecret";
      const token = jwt.sign(
        {
          mob_no: user.mob_no,
          user_id: user.id,
        },
        secretKey,
        {
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
        constants.responseObj(false, 500, i18n.__(`SomethingWentWrong`))
      );
    }
  } catch (error) {
    console.log(error, "error");
    // return res.json(constants.responseObj(false, 500, error));
    return res.json(
      constants.responseObj(false, 500, constants.messages.DuplicateNumber)
    );
  }
};

exports.usersLogin = async (req, res, next) => {
  const mob_no = req.body.mob_no;
  const Otp = req.body.otp;
  const country_code = req.body.country_code;
  let user = await UsersModel.findOne(
    {
      where: {
        mob_no: mob_no,
        country_code: country_code,
      },
    },
    {
      raw: true,
    }
  );

  if (!user) {
    return res.json(
      constants.responseObj(false, 401, constants.messages.UserNotFound)
    );
  }
  let i18n = languageFunc(user.language);
  if (user.otp == Otp) {
    const secretKey = process.env.SECRET_JWT || "theseissecret";
    const token = jwt.sign(
      {
        mob_no: user.mob_no,
        user_id: user.id,
      },
      secretKey,
      {
        expiresIn: "24h",
      }
    );
    user.dataValues.token = token;
    return res.json(
      constants.responseObj(true, 200, i18n.__(`UserLogin`), false, {
        user,
      })
    );
  } else {
    return res.json(
      constants.responseObj(false, 500, i18n.__(`SomethingWentWrong`))
    );
  }
};
exports.addEditPlayerId = async (req, res, next) => {
  const user_id = req.user_id;
  let i18n = languageFunc(req.language);
  console.log(user_id, "user_id logg");
  try {
    await UsersModel.update(
      {
        player_id: req.body.player_id,
      },
      { where: { id: user_id } }
    ).then((value) => {
      return res.json(
        constants.responseObj(true, 201, i18n.__(`UpdateStatus`))
      );
    });
  } catch (error) {
    console.log(error, "error");
    // return res.json(constants.responseObj(false, 500, error));
    return res.json(
      constants.responseObj(false, 500, i18n.__(`DuplicateNumber`))
    );
  }
};
