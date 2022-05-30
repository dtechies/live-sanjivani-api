require("dotenv").config();

const { constants, AWS, SNS } = require("../imports");
const { Message } = require("@aws-sdk/client-ses");

exports.getNotification = async (req, res, next) => {
  var deviceToken = req.body.deviceToken;
  var arn = "arn:aws:sns:us-east-2:421841545520:Testing";
  var subject = constants.messages.Subject;
  //   var message = `{
  //   "GCM": "{ \"data\": { \"title\": \"Sample message for Android endpoints\",\"message\": \"Sample message for Android endpoints\" } }"
  // }`;
  AWS.config.update({
    AWSAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    AWSSecretKey: process.env.AWS_SECRET_KEY,
    region: process.env.REGION,
  });
  var AWSTargetARN = process.env.AWS_TARGET_ARN;

  const params = {
    PlatformApplicationArn: `${process.env.PLATFORM_APPLICATION_ARN}`,
    Token: deviceToken,
  };

  SNS.createPlatformEndpoint(params, function (err, EndPointResult) {
    console.log(EndPointResult, "EndPointResult");
    var client_arn = EndPointResult["EndpointArn"];

    SNS.publish(
      {
        TargetArn: client_arn,
        MessageStructure: "json",
        Message: JSON.stringify({
          GCM: `{ "data": { "message": '${constants.messages.Message}', "title": '${constants.messages.Title}'} }`,
        }),
        Subject: subject,
      },
      function (err, data) {
        if (err) {
          return res.json(constants.responseObj(false, 500, err));
        } else {
          console.log("Sent message: " + data.MessageId);
          return res.json(
            constants.responseObj(true, 201, constants.messages.Success)
          );
        }
      }
    );
  });
};
