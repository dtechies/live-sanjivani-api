const { DoctorsModel, AppointmentReminderModel } = require("../imports");
const constants = require("../imports").constants;
const dotenv = require("dotenv");
let { jwt } = require("../imports/");
dotenv.config();

exports.addAppointmentReminderView = async (req, res, next) => {
  try {
    const DoctorsData = await DoctorsModel.findAll();

    return res.json(
      constants.responseObj(true, 201, constants.messages.DataFound, false, {
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
  const decoded = jwt.verify(token, secretKey);
  console.log("decoded logg", decoded);
  if (!decoded) {
    constants.responseObj(false, 500, constants.messages.SomethingWentWrong);
  }
  try {
    const AppointmentReminderProfileData =
      await AppointmentReminderModel.findAll({
        where: { user_id: decoded.user_id },
      });

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
  const DoctorData = await DoctorsModel.findOne({
    where: {
      doctor_name: req.body.doctor_name,
      speciality: req.body.speciality,
    },
  });
  console.log("found  DoctorData----", DoctorData);
  if (DoctorData) {
    let Doctor_id = DoctorData.id;
    console.log("found doc id----", Doctor_id);
  } else {
    const DoctorData = await DoctorsModel.create({
      doctor_name: req.body.doctor_name,
      speciality: req.body.speciality,
      doctor_address: req.body.doctor_address,
    });
    console.log("created  DoctorData----", DoctorData);
    if (!DoctorData) {
      return res.json(
        constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
      );
    }
    var Doctor_id = DoctorData.id;
    console.log("found doc id after created----", Doctor_id);
  }

  try {
    let AppointmentReminderData = {
      user_id: req.body.user_id,
      doctor_id: Doctor_id,
      address1: req.body.address1,
      address2: req.body.address2,
      date: req.body.date,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      user_selected_time: req.body.user_selected_time,
      reminder_time: req.body.reminder_time,
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
        constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
      );
    }
  } catch (error) {
    console.log(error, "error");
    return res.json(constants.responseObj(false, 500, error));
  }
};
