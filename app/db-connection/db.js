const db = require("../models");
const MedicineReminderModel = db.MedicineReminderModel;
const AppointmentReminderModel = db.AppointmentReminderModel;

MedicineReminderModel.destroy({ where: {} });
AppointmentReminderModel.destroy({ where: {} });
// sync database tables
// db.sequelize.sync({ alter: true });
