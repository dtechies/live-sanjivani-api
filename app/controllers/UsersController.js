const { UsersModel } = require("../imports");
const constants = require("../imports").constants;
let { jwt } = require("../imports");
const dotenv = require("dotenv");
const { raw } = require("express");
dotenv.config();
const { languageFunc } = require("../i18n/i18n");
const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.SMS_REGION,
});
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
              expiresIn: "30d",
            }
            );
            const refreshTokenSecretKey = process.env.REFRESH_SECRET_KEY;
            const refreshToken = jwt.sign(
              {
                mob_no: user.mob_no,
                user_id: user.id,
          },
          refreshTokenSecretKey,
          {
            expiresIn: "365d",
          }
          );
          const tokenTime = jwt.verify(token, secretKey);
          const refreshTokenTime = jwt.verify(
            refreshToken,
            refreshTokenSecretKey
            );
            
            user.dataValues.token = token;
            user.dataValues.refreshToken = refreshToken;
            user.dataValues.tokenTime = tokenTime.exp;
            user.dataValues.refreshTokenTime = refreshTokenTime.exp;
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
        console.log("error")
        return res.json(
          constants.responseObj(false, 500, i18n.__(`SomethingWentWrong`))
          );
        }
      // });
    } catch (error) {
      console.log(error, "error");
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
      console.log(typeof user.otp,typeof Otp,"otp++")
      if (user.otp == Otp) {
        console.log('here')
        const secretKey = process.env.SECRET_JWT;
        const refreshTokenSecretKey = process.env.REFRESH_SECRET_KEY;
        const token = jwt.sign(
          {
            mob_no: user.mob_no,
            user_id: user.id,
          },
          secretKey,
      {
        expiresIn: "30d",
      }
    );
    const refreshToken = jwt.sign(
      {
        mob_no: user.mob_no,
        user_id: user.id,
      },
      refreshTokenSecretKey,
      {
        expiresIn: "365d",
      }
    );
    const tokenTime = jwt.verify(token, secretKey);
    const refreshTokenTime = jwt.verify(refreshToken, refreshTokenSecretKey);

    user.dataValues.token = token;
    user.dataValues.refreshToken = refreshToken;
    user.dataValues.tokenTime = tokenTime.exp;
    user.dataValues.refreshTokenTime = refreshTokenTime.exp;
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

exports.generateTokenFromRefreshToken = async (req, res, next) => {
  try {
    const refreshTokenSecretKey = process.env.REFRESH_SECRET_KEY;
    const secretKey = process.env.SECRET_JWT;
    const decoded = jwt.verify(req.body.refresh_token, refreshTokenSecretKey);
    const token = jwt.sign(
      {
        mob_no: decoded.mob_no,
        user_id: decoded.user_id,
      },
      secretKey,
      {
        expiresIn: "30d",
      }
    );
    const refreshToken = jwt.sign(
      {
        mob_no: decoded.mob_no,
        user_id: decoded.user_id,
      },
      refreshTokenSecretKey,
      {
        expiresIn: "365d",
      }
    );
    const tokenTime = jwt.verify(token, secretKey);
    const refreshTokenTime = jwt.verify(refreshToken, refreshTokenSecretKey);
    let user = await UsersModel.findOne({
      where: {
        id: decoded.user_id,
      },
    });
    user.dataValues.token = token;
    user.dataValues.refreshToken = refreshToken;
    user.dataValues.tokenTime = tokenTime.exp;
    user.dataValues.refreshTokenTime = refreshTokenTime.exp;
    if (token) {
      return res.json(
        constants.responseObj(true, 200, constants.messages.Token, false, {
          user,
        })
      );
    } else {
      return res.json(
        constants.responseObj(false, 401, constants.messages.InvalidToken)
      );
    }
  } catch (err) {
    console.log(err, "errror");
    return res.json(
      constants.responseObj(false, 401, constants.messages.InvalidToken)
    );
  }
};
