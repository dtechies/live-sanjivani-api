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

module.exports = db;
