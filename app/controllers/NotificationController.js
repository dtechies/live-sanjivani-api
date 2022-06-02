require("dotenv").config();

const { constants } = require("../imports");
const AWS = require("aws-sdk");

exports.getNotification = async (req, res, next) => {
  var deviceToken = req.body.deviceToken;

  var subject = constants.messages.Subject;
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.PDF_REGION,
  });
  var SNS = new AWS.SNS();
  const params = {
    PlatformApplicationArn: `${process.env.PLATFORM_APPLICATION_ARN}`,
    Token: deviceToken,
  };

  SNS.createPlatformEndpoint(params, function (err, EndPointResult) {
    console.log(EndPointResult, "Its EndPointResults");
    var client_arn = EndPointResult["EndpointArn"];

    SNS.publish(
      {
        TargetArn: client_arn,
        MessageStructure: "json",
        Message: JSON.stringify({
          GCM: `{ \"data\": { \"title\": \"Sample message for Android endpoints\",\"message\": \"Sample message for Android endpoints\" } }`,
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
