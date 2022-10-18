const seeder = require("../seeder/tableData");

const addData = async () => {
  seeder.addCategory();
  seeder.addHelpSupport();
  seeder.addMedicineStrength();
  seeder.addReminderFrequencyData();
  seeder.addReminderTimeData();
  seeder.addSymptomData();
  seeder.addTipForDayData();
  seeder.addUserData();
};

addData();
