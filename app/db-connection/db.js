const db = require("../models");

// sync database tables
db.sequelize.sync({ alter: false });
