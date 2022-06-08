const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
const fileUpload = require("express-fileupload");
const db = require("./app/models");
const today = require("moment");


// To sync changes in database
// db.sequelize.sync();
// db.sequelize.sync({ alter: true });
//TODO: to sync changes in database

// To upload files
app.use(fileUpload({
  createParentPath: true
}));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true
}));

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow
  // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use(cors());

// simple route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome To Live Sanjivani"
  });
});

// Include All Routes
require("./app/routes/LanguageRoutes")(app);
require("./app/routes/CategoryRoutes")(app);
require("./app/routes/SubcategoryRoutes")(app);
require("./app/routes/FavoriteRoutes")(app);
require("./app/routes/UserRoutes")(app);
require("./app/routes/MedicineReminderRoutes")(app);
require("./app/routes/AppointmentReminderRoutes")(app);
require("./app/routes/MedicalJournalNoteRoutes")(app);
require("./app/routes/GenerateSendPdfRoutes")(app);
require("./app/routes/HelpSupportRoutes")(app);
require("./app/routes/GetOTPRoutes")(app);
require("./app/routes/GetNotificationRoutes")(app);
require("./app/routes/PDFDownloadRoutes")(app);
require("./app/routes/NestedSubcategoryRoutes")(app);
require("./app/routes/FavoriteValueGraphRoutes")(app);
require("./app/routes/UserProfileRoutes")(app);
require("./app/routes/CareGiverRoutes")(app);
require("./app/routes/MedicationListRoutes")(app);


// set port, listen for requests
const PORT = process.env.PORT || 1819;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
