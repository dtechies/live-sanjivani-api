const { MedicineReminderModel, moment, Op } = require("../imports");
const constants = require("../imports").constants;
const { languageFunc } = require("../i18n/i18n");

exports.medicationList = async (req, res, next) => {
  let timestamp = req.body.timestamp;
  let hours = timestamp.substr(0, timestamp.indexOf(":")).substring(1);
  let minute = timestamp.slice(-2);
  let op = timestamp.charAt(0);
  let i18n = languageFunc(req.language);
  const user_id = req.user_id;
  let today = moment().format("YYYY-MM-DD");
  let startDate = today + " 00:00:00";
  let endDate = today + " 23:59:59";
  console.log(startDate, endDate);
  console.log("date****", today);
  try {
    const medicineData = await MedicineReminderModel.findAll({
      attributes: [
        "reminder_name",
        "id",
        "user_selected_time",
        "dose",
        "medicine_name",
        "medicine_strength",
        "medicine_strength_unit",
        "reminder_frequency",
        "reminder_time",
        "status",
        "is_done",
        "medicine_form",
        "reminder_status",
        "user_selected_local_time",
      ],
      order: [["user_selected_time", "ASC"]],
      where: {
        user_id: user_id,
        status: true,
        [Op.or]: {
          frequency_value: today,
          reminder_frequency: "EveryDay",
        },
      },
    });
    if (medicineData.length) {
      for (let i = 0; i < medicineData.length; i++) {
        if (op === "+") {
          let eDate = today + ` ${medicineData[i].user_selected_time}`;
          medicineData[i].user_selected_time = moment(eDate)
            .add(Number(hours), "hours")
            .add(Number(minute), "minute")
            .format("HH:mm:ss");
        } else {
          let eDate = today + ` ${medicineData[i].user_selected_time}`;
          medicineData[i].user_selected_time = moment(eDate)
            .subtract(Number(hours), "hours")
            .subtract(Number(minute), "minute")
            .format("HH:mm:ss");
        }
      }
    }

    return res.json(
      constants.responseObj(true, 201, i18n.__(`DataFound`), false, {
        medicineData,
      })
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, i18n.__(`SomethingWentWrong`))
    );
  }
};
