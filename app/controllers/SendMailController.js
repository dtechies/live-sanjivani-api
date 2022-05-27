const constants = require("../imports").constants;
require("dotenv").config();

const { AWS } = require("../imports");

exports.sendMail = async (req, res, next) => {
  AWS.config.update({
    AWSAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    AWSSecretKey: process.env.AWS_SECRET_KEY,
    region: process.env.REGION,
  });

  const ses = new AWS.SES({
    AWSAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    AWSSecretKey: process.env.AWS_SECRET_KEY,
    region: process.env.REGION,
  });
  // Create sendEmail params
  var params = {
    Destination: {
      /* required */
      CcAddresses: [
        "codentic.users@gmail.com",
        /* more items */
      ],
      ToAddresses: ["boraddarshan332@gmail.com"] /* more items */,
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: `<h3>Health report</h3>
              <p>Download ypu pdf <a href="https://live-sanjivani.s3.us-east-2.amazonaws.com/userFavouriteCategoryPDF/W99X5DJ3A7.pdf">here</a></p>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "TEXT_FORMAT_BODY",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Test email",
      },
    },
    Source: "codentic.users@gmail.com" /* required */,
    ReplyToAddresses: [
      "boraddarshan332@gmail.com",
      /* more items */
    ],
  };
  ses.sendEmail(params, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(
        constants.responseObj(true, 201, constants.messages.Success)
      );
    } else {
      console.log(data);
      return res.json(
        constants.responseObj(true, 201, constants.messages.Success)
      );
    }
  });

  // Create the promise and SES service object
  var listIDsPromise = new AWS.SES({ apiVersion: "2010-12-01" })
    .listIdentities(params)
    .promise();

  // Handle promise's fulfilled/rejected states
  listIDsPromise
    .then(function (data) {
      console.log(data.Identities);
    })
    .catch(function (err) {
      console.error(err, err.stack);
    });
};
