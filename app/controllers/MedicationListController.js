const { MedicineReminderModel, moment, Op } = require("../imports");
const constants = require("../imports").constants;
const { languageFunc } = require("../i18n/i18n");

exports.medicationList = async (req, res, next) => {
  let i18n = languageFunc(req.language);
  const user_id = req.user_id;
  const created_at = req.body.created_at;

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
      ],
      where: {
        user_id: user_id,
        status: true,
        created_at: {
          [Op.between]: [startDate, endDate],
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
