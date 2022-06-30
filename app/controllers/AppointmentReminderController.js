const {
  DoctorsModel,
  AppointmentReminderModel,
  moment,
} = require("../imports");
const constants = require("../imports").constants;
const dotenv = require("dotenv");

dotenv.config();
const { languageFunc } = require("../i18n/i18n");

exports.addAppointmentReminderView = async (req, res, next) => {
  try {
    let i18n = languageFunc(req.language);
    const DoctorsData = await DoctorsModel.findAll();

    return res.json(
      constants.responseObj(true, 201, i18n.__(`DataFound`), false, {
        DoctorsData,
      })
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, i18n.__(`SomethingWentWrong`))
    );
  }
};

exports.getAppointmentReminderProfile = async (req, res, next) => {
  let i18n = languageFunc(req.language);
  const user_id = req.user_id;

  try {
    const AppointmentReminderProfileData =
      await AppointmentReminderModel.findAll({
        where: {
          user_id: user_id,
        },
        include: [
          {
            model: DoctorsModel,
            attributes: ["id", "doctor_name", "doctor_address"],
          },
        ],
      });
    return res.json(
      constants.responseObj(true, 201, i18n.__(`DataFound`), false, {
        AppointmentReminderProfileData,
      })
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, i18n.__(`SomethingWentWrong`))
    );
  }
};

exports.editAppointmentReminderStatus = async (req, res, next) => {
  try {
    let i18n = languageFunc(req.language);
    let editAppointmentStatus = await AppointmentReminderModel.update(
      {
        status: req.body.status,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    );

    return res.json(
      constants.responseObj(true, 201, i18n.__(`UpdateStatus`), false)
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, i18n.__(`SomethingWentWrong`))
    );
  }
};

exports.addAppointmentReminder = async (req, res, next) => {
  let i18n = languageFunc(req.language);
  const DoctorData = await DoctorsModel.findOne({
    where: {
      doctor_name: req.body.doctor_name,
    },
  });
  if (DoctorData) {
    var Doctor_id = DoctorData.id;
    await DoctorsModel.update(
      {
        doctor_address: req.body.doctor_address,
      },
      { where: { id: Doctor_id } }
    );
  } else {
    const DoctorData = await DoctorsModel.create({
      doctor_name: req.body.doctor_name,
      doctor_address: req.body.doctor_address,
    });
    if (!DoctorData) {
      return res.json(
        constants.responseObj(false, 500, i18n.__(`SomethingWentWrong`))
      );
    }
    var Doctor_id = DoctorData.id;
  }

  try {
    const utc_date_and_time = moment
      .utc(`${req.body.utc_date_and_time}`)
      .format();
    const local_date = moment
      .utc(utc_date_and_time)
      .local()
      .format("YYYY-MM-DD");
    const local_time = moment.utc(utc_date_and_time).local().format("HH:mm:ss");
    console.log(local_date, local_time, "- UTC now to local");
    let AppointmentReminderData = {
      user_id: req.body.user_id,
      doctor_id: Doctor_id,
      // address1: req.body.address1,
      // address2: req.body.address2,
      date: local_date,
      // city: req.body.city,
      // state: req.body.state,
      // pincode: req.body.pincode,
      user_selected_time: local_time,
      user_selected_local_time: req.body.user_selected_time,
      reminder_time: req.body.reminder_time,
      status: true,
    };
    const AppointmentReminder = await AppointmentReminderModel.create(
      AppointmentReminderData
    );
    if (AppointmentReminder) {
      return res.json(constants.responseObj(true, 201, i18n.__(`AddSuccess`)));
    } else {
      return res.json(
        constants.responseObj(false, 500, i18n.__(`SomethingWentWrong`))
      );
    }
  } catch (error) {
    console.log(error, "error");
    return res.json(constants.responseObj(false, 500, error.parent));
  }
};
