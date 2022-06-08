require("dotenv").config();

const { constants } = require("../imports");
const AWS = require("aws-sdk");
var https = require("https");

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
          return res.json(
            constants.responseObj(true, 201, constants.messages.Success)
          );
        }
      }
    );
  });
};

exports.sendNotification = async (req, res, next) => {
  let title = "Medicine Reminder";
  var sendNotification = function (data) {
    var headers = {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: "Basic YzlmNzkxZmMtNWIwMi00NzJjLWI0NWMtOGY3NzZhNDdmYzM0",
    };
    var options = {
      host: "onesignal.com",
      port: 443,
      path: "/api/v1/notifications",
      method: "POST",
      headers: headers,
    };
    var newReq = https.request(options, function (newRes) {
      console.log(newRes, "newRes logg");
      newRes.on("data", function (data) {
        console.log("Response:");
        console.log(JSON.parse(data));
        data = JSON.parse(data);
      });
    });
    newReq.write(JSON.stringify(data));
    newReq.end();
  };
  var message = {
    app_id: "3b7300ff-2be3-46f8-ad6a-5473e664b134",
    contents: {
      en: "You have Medicine Reminder",
    },
    data: {
      medicine_name: "paracetamol",
      medicine_strength: 5,
      medicine_strength_unit: "dk",
      reminder_frequency: "After Meal",
      frequency_value: "18:40 AM",
      type: "reminder",
      reminder_time: "Everyday",
      reminder_name: "medicine",
      dose: 1,
      medicine_form: "dk",
    },
    headings: { en: title },
    // included_segments: ["Subscribed Users"],
    include_player_ids: ["d83f85df-a6f5-4846-a3af-52451f7a7826"],
  };
  sendNotification(message);
  // const sdk = require("api")("@onesignal/v9.0#vkskhql3uu3ucg");
  // sdk["create-notification"](
  //   {
  //     app_id: "3b7300ff-2be3-46f8-ad6a-5473e664b134",
  //     included_segments: ["d83f85df-a6f5-4846-a3af-52451f7a7826"],
  //     external_id: "d83f85df-a6f5-4846-a3af-52451f7a7826",
  //     contents: {
  //       en: "English or Any Language Message",
  //       es: "Spanish Message",
  //     },
  //     name: "INTERNAL_CAMPAIGN_NAME",
  //     send_after: "string",
  //     delayed_option: "string",
  //     delivery_time_of_day: "string",
  //     throttle_rate_per_minute: 0,
  //   },
  //   {
  //     Authorization: "Basic YzlmNzkxZmMtNWIwMi00NzJjLWI0NWMtOGY3NzZhNDdmYzM0",
  //   }
  // )
  //   .then((res) => console.log(res))
  //   .catch((err) => console.error(err));
};
