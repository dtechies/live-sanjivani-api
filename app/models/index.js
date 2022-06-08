require("dotenv").config();
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: "localhost",
    dialectOptions: {
      socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
      // socketPath: ""
    },
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.UsersModel = require("./UsersModel")(sequelize, Sequelize);
db.DoctorsModel = require("./DoctorsModel")(sequelize, Sequelize);
db.MedicineDataModel = require("./MedicineDataModel")(sequelize, Sequelize);
db.MedicineStrengthModel = require("./MedicineStrengthModel")(
  sequelize,
  Sequelize
);
db.ReminderFrequencyModel = require("./ReminderFrequencyModel")(
  sequelize,
  Sequelize
);
db.ReminderTimeModel = require("./ReminderTimeModel")(sequelize, Sequelize);
db.MedicineReminderModel = require("./MedicineReminderModel")(
  sequelize,
  Sequelize
);
db.LanguageModel = require("./LanguageModel")(sequelize, Sequelize);
db.CategoryModel = require("./CategoryModel")(sequelize, Sequelize);
db.SubCategoryModel = require("./SubcategoryModel")(sequelize, Sequelize);
db.UserSubcategoriesValueModel = require("./UserSubcategoriesValueModel")(
  sequelize,
  Sequelize
);
db.TipForDayModel = require("./TipForDayModel")(sequelize, Sequelize);
db.AppointmentReminderModel = require("./AppointmentReminderModel")(
  sequelize,
  Sequelize
);
db.MedicalJournalNoteModel = require("./MedicalJournalNoteModel")(
  sequelize,
  Sequelize
);
db.HelpSupportModel = require("./HelpSupportModel")(sequelize, Sequelize);
db.NestedSubcategoryModel = require("./NestedSubcategoryModel")(
  sequelize,
  Sequelize
);
db.FavoriteModel = require("./FavoriteModel")(sequelize, Sequelize);
db.CareGiverModel = require("./CareGiverModel")(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});
module.exports = db;
