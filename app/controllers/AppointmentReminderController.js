const {
  DoctorsModel,
  AppointmentReminderModel,
  
} = require("../imports");
const constants = require("../imports").constants;
const { S3 } = require("../imports");
const dotenv = require("dotenv");
let { jwt } = require("../imports/");
dotenv.config();

exports.getAppointmentReminderList = async (req, res, next) => {
  try {
    
    const AppointmentData = await AppointmentReminderModel.findAll();
    const DoctorsData = await DoctorsModel.findAll();
    
    return res.json(
      constants.responseObj(true, 201, constants.messages.DataFound, false, {
        AppointmentData,
        DoctorsData,
      })
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
    );
  }
};


exports.getAppointmentReminderProfile = async (req, res, next) => {
    const authHeader = req.headers.authorization;
        const token = authHeader.replace("Bearer ", "");
        const secretKey = process.env.SECRET_JWT || "theseissecret";
        const decoded = jwt.verify(token, secretKey)
        console.log("decoded logg",decoded)
        if(!decoded){
            constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
        }
  try {
    const AppointmentReminderProfileData = await AppointmentReminderModel.findAll({where:{id:decoded.user_id}});
   

    return res.json(
      constants.responseObj(true, 201, constants.messages.DataFound, false, {
        AppointmentReminderProfileData,      
      })
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
    );
  }
};

exports.editAppointmentReminderStatus = async (req, res, next) => {
  try {
    let editAppointmentStatus = await AppointmentReminderModel.update(
      { status: req.body.status },
      { where: { id: req.body.id } }
    );

    return res.json(
      constants.responseObj(true, 201, constants.messages.UpdateStatus, false)
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
    );
  }
};

exports.addAppointmentReminder = async (req, res, next) => {
  try {
   
        let AppointmentReminderData = {
          user_id: req.body.user_id,
          doctor_name: req.body.doctor_name,
          address1: req.body.address1,
          address2: req.body.address2,
          date: req.body.date,
          city: req.body.city,
          state: req.body.state,
          pincode: req.body.pincode,
          user_selected_time: req.body.user_selected_time,
          status: true,
        };
        const AppointmentReminder = await AppointmentReminderModel.create(
          AppointmentReminderData
        );
        if (AppointmentReminder) {
          return res.json(
            constants.responseObj(true, 201, constants.messages.AddSuccess)
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
      }
    catch (error) {
    console.log(error, "error");
    return res.json(constants.responseObj(false, 500, error.errors[0].message));
  }
};


