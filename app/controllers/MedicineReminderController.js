const {
  DoctorsModel,
  MedicineDataModel,
  MedicineStrengthModel,
  ReminderFrequencyModel,
  ReminderTimeModel,
  MedicineReminderModel,
  moment,
} = require("../imports");
const constants = require("../imports").constants;
const { S3 } = require("../imports");
const dotenv = require("dotenv");
const { TipForDayModel } = require("../models");
dotenv.config();

exports.addMedicineReminderView = async (req, res, next) => {
  try {
    const DoctorsData = await DoctorsModel.findAll();
    const MedicineData = await MedicineDataModel.findAll();
    const MedicineStrengthData = await MedicineStrengthModel.findAll();
    const ReminderFrequencyData = await ReminderFrequencyModel.findAll();
    const ReminderTimeData = await ReminderTimeModel.findAll();
    const MedicineFormData = await ReminderTimeModel.findAll();

    return res.json(
      constants.responseObj(true, 201, constants.messages.DataFound, false, {
        DoctorsData,
        MedicineData,
        MedicineStrengthData,
        ReminderFrequencyData,
        ReminderFrequencyData,
        ReminderTimeData,
      })
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
    );
  }
};

exports.getMedicineReminderProfile = async (req, res, next) => {
  const user_id = req.user_id;
  try {
    const MedicineReminderProfileData = await MedicineReminderModel.findAll({
      where: {
        user_id: user_id,
      },
    });

    return res.json(
      constants.responseObj(true, 201, constants.messages.DataFound, false, {
        MedicineReminderProfileData,
      })
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
    );
  }
};

exports.editMedicineReminderStatus = async (req, res, next) => {
  try {
    let editMedicineStatus = await MedicineReminderModel.update(
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
      constants.responseObj(
        true,
        201,
        constants.messages.UpdateStatus,
        false,
        editMedicineStatus
      )
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
    );
  }
};

exports.editReminderStatus = async (req, res, next) => {
  try {
    let editMedicineStatus = await MedicineReminderModel.update(
      {
        reminder_status: req.body.reminder_status,
        is_done: true,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    );

    return res.json(
      constants.responseObj(
        true,
        201,
        constants.messages.UpdateStatus,
        false,
        editMedicineStatus
      )
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
    );
  }
};
exports.getTipForDay = async (req, res, next) => {
  // const user_id = req.user_id;

  try {
    const TipForDayData = await TipForDayModel.findOne({
      // where: {
      //   id: user_id,
      // },
    });
    return res.json(
      constants.responseObj(
        true,
        201,
        constants.messages.DataFound,
        false,
        TipForDayData
      )
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
    );
  }
};

exports.addMedicineReminder = async (req, res, next) => {
  // const DoctorData = await DoctorsModel.findOne({
  //   where: {
  //     doctor_name: req.body.doctor_name,
  //   },
  // });
  // if (DoctorData) {
  //   var Doctor_id = DoctorData.id;
  // } else {
  // }
  const DoctorData = await DoctorsModel.create({
    doctor_name: req.body.doctor_name,
  });
  if (!DoctorData) {
    return res.json(
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
    );
  }
  var Doctor_id = DoctorData.id;

  //
  const MedicineData = await MedicineDataModel.findOne({
    where: {
      name: req.body.medicine_name,
    },
  });
  var medicine_id;
  var medicine_name;
  if (MedicineData) {
    medicine_id = MedicineData.id;
    medicine_name = MedicineData.name;
  } else {
    const MedicineData = await MedicineDataModel.create({
      name: req.body.medicine_name,
    });
    if (!MedicineData) {
      return res.json(
        constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
      );
    }
    medicine_id = MedicineData.id;
    medicine_name = MedicineData.name;
  }

  try {
    if (req.files) {
      let medicine_image = req.files.medicine_image;
      let filename = medicine_image.name;
      let imgAttachement = Date.now() + "_" + filename;
      imageUpload(medicine_image, imgAttachement, async function (err, images) {
        if (err) {
          console.log(err, "err logg");
          return res.json(
            constants.responseObj(false, 422, constants.messages.InvalidFile)
          );
        } else {
          let medicineReminderData = {
            user_id: req.body.user_id,
            doctor_id: Doctor_id,
            medicine_id: medicine_id,
            medicine_name: medicine_name,
            reminder_name: req.body.reminder_name,
            medicine_image: images.image,
            medicine_form: req.body.medicine_form,
            dose: req.body.dose,
            medicine_strength: req.body.medicine_strength,
            medicine_strength_unit: req.body.medicine_strength_unit,
            reminder_frequency: req.body.reminder_frequency,
            frequency_value: req.body.frequency_value,
            reminder_time: req.body.reminder_time,
            user_selected_time: req.body.user_selected_time,
            status: true,
            is_done: false,
          };
          req.body.pills_remaining
            ? (medicineReminderData["pills_remaining"] =
                req.body.pills_remaining)
            : "";
          console.log(medicineReminderData, "medicineReminderData logg");
          const medicineReminder = await MedicineReminderModel.create(
            medicineReminderData
          );
          if (medicineReminder) {
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
      });
    } else {
      let medicineReminderData = {
        user_id: req.body.user_id,
        doctor_id: Doctor_id,
        medicine_id: medicine_id,
        medicine_name: medicine_name,
        reminder_name: req.body.reminder_name,
        medicine_form: req.body.medicine_form,
        dose: req.body.dose,
        medicine_strength: req.body.medicine_strength,
        medicine_strength_unit: req.body.medicine_strength_unit,
        reminder_frequency: req.body.reminder_frequency,
        frequency_value: req.body.frequency_value,
        reminder_time: req.body.reminder_time,
        user_selected_time: req.body.user_selected_time,
        status: true,
        is_done: false,
      };
      req.body.pills_remaining
        ? (medicineReminderData["pills_remaining"] = req.body.pills_remaining)
        : "";
      console.log(medicineReminderData, "medicineReminderData logg");
      const medicineReminder = await MedicineReminderModel.create(
        medicineReminderData
      );
      if (medicineReminder) {
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
  } catch (error) {
    console.log(error, "error");
    return res.json(constants.responseObj(false, 500, error.parent));
  }
};

function imageUpload(image, imgAttachement, cb) {
  var params = {
    Bucket: "live-sanjivani",
    ContentEncoding: image.encoding,
    Body: image.data,
    Key: "medicineReminderImages/" + imgAttachement,
    ContentType: image.mimetype,
    ACL: "public-read",
  };
  S3.upload(params, function (err, data) {
    if (err) {
      console.log(err);
      cb(true, null);
    } else {
      cb(null, {
        image: data.Location.split("/").pop(),
      });
    }
  });
}
exports.todaysMedicineReminderList = async (req, res, next) => {
  let user_id = req.user_id;
  console.log(user_id, "user_id logg");
  let todays_date = moment().format("YYYY-MM-DD");
  console.log(todays_date, "todays_date logg");
  try {
    const MedicineReminderData = await MedicineReminderModel.findAll({
      where: { user_id: user_id, created_at: todays_date },
    });
    if (MedicineReminderData.length) {
      return res.json(
        constants.responseObj(true, 201, constants.messages.DataFound, false, {
          MedicineReminderData,
        })
      );
    } else {
      return res.json(
        constants.responseObj(false, 404, constants.messages.NoDataFound, false)
      );
    }
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
    );
  }
};
