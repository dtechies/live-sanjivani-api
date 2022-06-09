require("dotenv").config();

const {
  constants,
  MedicineReminderModel,
  AppointmentReminderModel,
  moment,
  UsersModel,
  DoctorsModel,
} = require("../imports");
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
  const MedicineReminderProfileData = await MedicineReminderModel.findAll({
    raw: true,
    logging: false,
    where: { status: true },
    include: [
      {
        model: UsersModel,
        attributes: ["player_id"],
      },
    ],
  });

  MedicineReminderProfileData.forEach((medicine_data) => {
    // console.log(medicine_data);
    // console.log(medicine_data, "medicine_data logg");
    let current_date = moment().format("YYYY-MM-DD");
    let current_time = moment().format("HH:mm:ss");
    if (medicine_data.reminder_frequency == "EveryDay") {
      if (medicine_data.user_selected_time == current_time) {
        if (medicine_data["user.player_id"]) {
          sendNotifications(medicine_data);
        }
      }
    } else if (medicine_data.reminder_frequency == "Fixed Date") {
      if (current_date == medicine_data.frequency_value) {
        if (medicine_data.user_selected_time == current_time) {
          if (medicine_data["user.player_id"]) {
            sendNotifications(medicine_data);
          }
        }
      }
    } else if (medicine_data.reminder_frequency == "Alternate Day") {
      if (current_date == medicine_data.frequency_value) {
        if (medicine_data.user_selected_time == current_time) {
          var new_date = moment(medicine_data.frequency_value, "YYYY-MM-DD")
            .add(2, "days")
            .format("YYYY-MM-DD");
          MedicineReminderModel.update(
            {
              frequency_value: new_date,
            },
            {
              where: {
                id: medicine_data.id,
              },
            }
          );
          if (medicine_data["user.player_id"]) {
            sendNotifications(medicine_data);
          }
        }
      }
    } else if (medicine_data.reminder_frequency == "Once A Week") {
      if (current_date == medicine_data.frequency_value) {
        if (medicine_data.user_selected_time == current_time) {
          var new_date = moment(medicine_data.frequency_value, "YYYY-MM-DD")
            .add(7, "days")
            .format("YYYY-MM-DD");
          MedicineReminderModel.update(
            {
              frequency_value: new_date,
            },
            {
              where: {
                id: medicine_data.id,
              },
            }
          );
          if (medicine_data["user.player_id"]) {
            sendNotifications(medicine_data);
          }
        }
      }
    }
  });
};

exports.sendNotificationForAppointmentReminder = async (req, res, next) => {
  const AppointmentReminderModelData = await AppointmentReminderModel.findAll({
    raw: true,
    logging: false,
    where: { status: 1 },
    include: [
      {
        model: UsersModel,
        attributes: ["player_id"],
      },
      {
        model: DoctorsModel,
        attributes: ["doctor_name", "doctor_address"],
      },
    ],
  });

  AppointmentReminderModelData.forEach((appointment_data) => {
    let current_date = moment().format("YYYY-MM-DD");
    if (current_date == appointment_data.date) {
      let current_time = moment().format("HH:mm:ss");
      if (appointment_data.user_selected_time == current_time) {
        if (appointment_data["user.player_id"]) {
          sendNotificationsForAppointment(appointment_data);
        }
      }
    }
  });
};
async function sendNotifications(medicine_data) {
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
      id: medicine_data.id,
      medicine_name: medicine_data.medicine_name,
      medicine_strength: medicine_data.medicine_strength,
      medicine_strength_unit: medicine_data.medicine_strength_unit,
      reminder_frequency: medicine_data.reminder_frequency,
      frequency_value: medicine_data.frequency_value,
      type: "reminder",
      reminder_time: medicine_data.reminder_time,
      reminder_name: medicine_data.reminder_name,
      user_selected_time: medicine_data.user_selected_time,
      dose: medicine_data.dose,
      medicine_form: medicine_data.medicine_form,
    },
    headings: { en: title },
    // included_segments: ["Subscribed Users"],
    include_player_ids: [medicine_data["user.player_id"]],
  };
  sendNotification(message);
}
async function sendNotificationsForAppointment(appointment_data) {
  let title = "Appointment Reminder";
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
      en: "You have Appointment Reminder",
    },
    data: {
      id: appointment_data.id,
      type: "appointment_reminder",
      doctor_name: appointment_data["doctor.doctor_name"],
      doctor_address: appointment_data["doctor.doctor_address"],
      user_selected_time: appointment_data.user_selected_time,
    },
    headings: { en: title },
    // included_segments: ["Subscribed Users"],
    include_player_ids: [appointment_data["user.player_id"]],
  };
  sendNotification(message);
}
