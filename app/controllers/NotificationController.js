
const constants = require("../imports").constants;
require('dotenv').config();


const { UsersModel } = require('../imports');
var AWS = require('aws-sdk');
const { Message } = require("@aws-sdk/client-ses");
 
 exports.getNotification = async (req, res, next) => {

var deviceToken =req.body.deviceToken; 
var arn ="arn:aws:sns:us-east-2:421841545520:Testing"

var AWS = require('aws-sdk');

AWS.config.update({
  AWSAccessKeyId:process.env.AWSAccessKeyId,
  AWSSecretKey:process.env.AWSSecretKey,
  region:process.env.region
});
var AWSTargetARN=process.env.AWSTargetARN
var sns = new AWS.SNS();

//var params = {'PlatformApplicationArn':arn,'Token':token};

var message = `{
  "GCM": "{ \"data\": { \"title\": \"Sample message for Android endpoints\",\"message\": \"Sample message for Android endpoints\" } }"
}`;
var subject = 'back end Notification';
// { \"title\": \"Sample message for Android endpoints\", \"message\":\"Sample message for Android endpoints\"}

// { \“body\“: \“Sample message for Android endpoints\“, \“title\“:\“TitleTest\” },
// const createSNSEndpoint = (deviceToken) => {
  const params = {
    PlatformApplicationArn:  'arn:aws:sns:ap-south-1:421841545520:app/GCM/demo-notification',
    Token: deviceToken
  };
//    console.log(sns.createPlatformEndpoint(params).promise(),"---------------dacfdta")
//   return sns.createPlatformEndpoint(params).promise();
  
// };
// createSNSEndpoint(deviceToken).then((result) => {
//     console.log(result)
//   });
//    sns.createPlatformEndpoint({
//     PlatformApplicationArn: 'arn:aws:sns:us-east-2:421841545520:Testing',
//     Token: token
//    }, function (err, data) {
//     if (err) {
//      console.log("errorMessag4
//    console.log(createSNSEndpoint,"---------------data")

sns.createPlatformEndpoint(params,function(err,EndPointResult)
{
    console.log(EndPointResult,"EndPointResult")
    var client_arn = EndPointResult["EndpointArn"];

    sns.publish({
    TargetArn: client_arn,
    MessageStructure: 'json',
    Message: JSON.stringify({
  
  "GCM": "{ \"data\": { \"message\": \"Sample message for Android endpoints\", \"title\": \"Sample message for Android endpoints\" } }"

}),
    Subject: subject, },
        function(err,data){
        if (err)
        {
           return res.json(constants.responseObj(false, 500, err));
        }
        else
        {
            console.log("Sent message: "+data.MessageId);
            return res.json(constants.responseObj(true, 201, constants.messages.Success));

        }
    });
});
 }
