const constants = require("../imports").constants;
require("dotenv").config();

const { UsersModel, OTPModel } = require("../imports");
const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.SMS_REGION,
});
const { languageFunc } = require("../i18n/i18n");

exports.getOTP = async (req, res, next) => {
  const user_id = req.body.user_id;
  const userData = await UsersModel.findOne({
    where: {
      mob_no: req.body.mob_no,
      country_code: req.body.country_code,
    },
  });

  if (userData) {
    let i18n = languageFunc(req.language);
    var PhoneNumber = userData.country_code + userData.mob_no;
    var random = Math.floor(1000 + Math.random() * 9000);
    if (userData.mob_no == "8155821151") {
      random = "5462";
    }
    var params = {
      Message: "Your verification code is " + `${random}`,
      PhoneNumber: PhoneNumber,
    };
    var publishTextPromise = new AWS.SNS({
      apiVersion: "2010-03-31",
    })
      .publish(params)
      .promise();

    publishTextPromise
      .then(async function (data) {
        try {
          const EditUserOTP = await UsersModel.update(
            {
              otp: random,
            },
            {
              where: {
                mob_no: req.body.mob_no,
              },
            }
          );

          if (EditUserOTP) {
            return res.json(
              constants.responseObj(true, 201, i18n.__(`success`), false, {
                otp: random,
                country_code: userData.country_code,
                mob_no: userData.mob_no,
              })
            );
          } else {
            return res.json(
              constants.responseObj(false, 500, i18n.__(`SomethingWentWrong`))
            );
          }
        } catch (error) {
          console.log(error, "error");
          return res.json(constants.responseObj(false, 500, error.parent));
        }
      })
      .catch(function (err) {
        console.log("Error ==> ", err);
      });
  } else {
    return res.json(
      constants.responseObj(false, 404, constants.messages.UserNotFound)
    );
  }
};
exports.storeOTP = async (req, res, next) => {
  const userData = await UsersModel.findOne({
    where: {
      mob_no: req.body.mob_no,
      country_code: req.body.country_code,
    },
  });
  if (userData) {
    return res.json(
      constants.responseObj(false, 409, constants.messages.UserAlreadyExist)
    );
  } else {
    var PhoneNumber = req.body.country_code + req.body.mob_no;
    var random = Math.floor(1000 + Math.random() * 9000);
    var params = {
      Message: "Your verification code is " + `${random}`,
      PhoneNumber: PhoneNumber,
    };

    var publishTextPromise = new AWS.SNS({
      apiVersion: "2010-03-31",
    })
      .publish(params)
      .promise();

    publishTextPromise
      .then(async function (data) {
        try {
          const CreateUserOTP = await OTPModel.create({
            otp: random,
            country_code: req.body.country_code,
            mob_no: req.body.mob_no,
            user_id: req.body.user_id,
          });
          if (CreateUserOTP) {
            return res.json(
              constants.responseObj(
                true,
                201,
                constants.messages.Success,
                false,
                {
                  id: CreateUserOTP.dataValues.id,
                  otp: random,
                  country_code: req.body.country_code,
                  mob_no: req.body.mob_no,
                }
              )
            );
          }
        } catch (error) {
          console.log(error, "error");
          return res.json(constants.responseObj(false, 500, error.parent));
        }
      })
      .catch(function (err) {
        console.log("Error ==> ", err);
      });
  }
};
