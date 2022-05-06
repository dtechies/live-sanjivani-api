const constants = require("../imports").constants;
require('dotenv').config();

const { UsersModel } = require('../imports');
var AWS = require('aws-sdk');
 
 exports.getOTP = async (req, res, next) => {
  
  AWS.config.update({
  AWSAccessKeyId:process.env.AWSAccessKeyId,
  AWSSecretKey:process.env.AWSSecretKey,
  region:process.env.region
});

var sns = new AWS.SNS();
var PhoneNumber= '+' + '917046892973';

      var random = Math.floor(1000 + Math.random() * 9000)
       
    var params = {
        Message: "Your verification code is "+`${random}`,
        PhoneNumber: PhoneNumber
    };

    var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();

  publishTextPromise.then(
     async  function  (data) {
           console.log("Success ==> ",data);

        try {
            
        const EditUserOTP = await UsersModel.update({otp:random},{where:{mob_no:PhoneNumber.replace('+91','')}});

        if (EditUserOTP) {
          return res.json(constants.responseObj(true, 201, constants.messages.Success,false,{otp:random}));
        } else {
          return res.json(constants.responseObj(false,500,constants.messages.SomethingWentWrong));
        }
        }catch (error) {
    console.log(error, "error");
    return res.json(constants.responseObj(false, 500, error.errors[0].message));
  }
  }).catch(
        function (err) {
            console.log("Error ==> ",err);
       });
 
 }


 


