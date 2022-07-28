const { MedicineReminderModel, moment, Op } = require("../imports");
const constants = require("../imports").constants;
const { languageFunc } = require("../i18n/i18n");

exports.medicationList = async (req, res, next) => {
  let i18n = languageFunc(req.language);
  const user_id = req.user_id;
  let today = moment().format("YYYY-MM-DD");
  let startDate = today + " 00:00:00";
  let endDate = today + " 23:59:59";
  console.log(startDate, endDate);
  console.log("date****", today);
  try {
    const MedicineData = await MedicineReminderModel.findAll({
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
      where: {
        user_id: user_id,
        status: true,
        [Op.or]: {
          frequency_value: today,
          reminder_frequency: "EveryDay",
        },
      },
    });

    return res.json(
      constants.responseObj(true, 201, i18n.__(`DataFound`), false, {
        MedicineData,
      })
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, i18n.__(`SomethingWentWrong`))
    );
  }
};
