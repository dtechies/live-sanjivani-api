const {
    AppointmentReminderModel,
    MedicineReminderModel,
    jwt,
    moment,
} = require("../imports");
const constants = require("../imports").constants;
const {
    checkUser
} = require("../utils/Utils");

exports.medicationList = async (req, res, next) => {
    const user_id = req.user_id;
    const created_at = req.body.created_at;
    // let todays_date = moment().calendar()

    let today = moment().format('YYYY-MM-DD');

    // let tdate = created_at.toDate();
    // console.log(tdate)
    // let todays_date = moment().date
    // let todays_date = (moment.format('YYYY-MM-DD'));
    // todays_date.toDate();
    console.log("date", today);
    try {
        const MedicineData = await MedicineReminderModel.findAll({
            attributes: ["reminder_name", "id", "user_selected_time", "dose", "medicine_name", "medicine_strength_unit", "reminder_frequency", "reminder_time", "status"],
            where: {
                user_id: user_id,
                // created_at: today
            },
        });

        return res.json(
            constants.responseObj(true, 201, constants.messages.DataFound, false, {
                MedicineData,
            })
        );
    } catch (error) {
        console.log(error, "error");
        return res.json(
            constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
        );
    }
};
