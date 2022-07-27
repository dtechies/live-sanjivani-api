const db = require("../models");

db.sequelize.drop({ drop: true });
