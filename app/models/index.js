require("dotenv").config();
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
	process.env.DB,
  process.env.DB_USER,
  process.env.DB_PASSWORD, {
	dialect: 'mysql',
	host: 'localhost',
  dialectOptions: {
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
  }
	}
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.UsersModel = require('./UsersModel')(sequelize, Sequelize);
db.DoctorsModel = require('./DoctorsModel')(sequelize, Sequelize);
db.MedicineFormModel = require('./MedicineFormModel')(sequelize, Sequelize);
db.MedicineStrengthModel = require('./MedicineStrengthModel')(sequelize, Sequelize);
db.ReminderFrequencyModel = require('./ReminderFrequencyModel')(sequelize, Sequelize);
db.ReminderTimeModel = require('./ReminderTimeModel')(sequelize, Sequelize);
db.MedicineReminderModel = require('./MedicineReminderModel')(sequelize, Sequelize);

module.exports = db;
