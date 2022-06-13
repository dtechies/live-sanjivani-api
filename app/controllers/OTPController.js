const constants = require("../imports").constants;
require("dotenv").config();

const { UsersModel } = require("../imports");

const { AWS } = require("../imports");

exports.getOTP = async (req, res, next) => {
  const user_id = req.body.user_id;
  const userData = await UsersModel.findOne({
    where: {
      mob_no: req.body.mob_no,
    },
  });

  if (userData) {
    var PhoneNumber = userData.country_code + userData.mob_no;
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
          console.log("otppp", otp);
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
              constants.responseObj(
                true,
                201,
                constants.messages.Success,
                false,
                {
                  otp: random,
                  country_code: userData.country_code,
                  mob_no: userData.mob_no,
                }
              )
            );
          } else {
            return res.json(
              constants.responseObj(
                false,
                500,
                constants.messages.SomethingWentWrong
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

    publishTextPromise.then(async function (data) {
      if (user_id) {
        try {
          const EditUserOTP = await UsersModel.update(
            {
              otp: random,
            },
            // { where: { mob_no: PhoneNumber.replace("+91", "") } }
            {
              where: {
                id: req.body.user_id,
              },
            }
          );

          return res.json(
            constants.responseObj(
              true,
              201,
              constants.messages.Success,
              false,
              {
                otp: random,
              }
            )
          );
        } catch (error) {
          console.log(error, "error");
          return res.json(constants.responseObj(false, 500, error.parent));
        }
      } else {
        try {
          const EditUserOTP = await UsersModel.update(
            {
              otp: random,
            },
            // { where: { mob_no: PhoneNumber.replace("+91", "") } }
            {
              where: {
                mob_no: req.body.mob_no,
              },
            }
          );

          return res.json(
            constants.responseObj(
              true,
              201,
              constants.messages.Success,
              false,
              {
                otp: random,
              }
            )
          );
        } catch (error) {
          console.log(error, "error");
          return res.json(constants.responseObj(false, 500, error.parent));
        }
      }
    });
  }
};
