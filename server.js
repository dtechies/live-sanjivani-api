const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require("dotenv").config();
const app = express();
const fileUpload = require('express-fileupload')
const db = require('./app/models');
//   db.sequelize.sync();
//  db.sequelize.sync({ alter: true });

// Should Use  Development only
// db.sequelize.sync({ force: true }).then(() => {
//   console.log('Drop and re-sync db.');
// });
app.use(fileUpload({ createParentPath: true }));

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
var corsOptions = {
  origin: 'http://localhost:1818',
};

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome To Live Sanjivani' });
});
// Include All Routes
require('./app/routes/LanguageRoutes')(app);
require('./app/routes/CategoryRoutes')(app);
require('./app/routes/SubcategoryRoutes')(app);
require('./app/routes/FavoriteRoutes')(app);
require('./app/routes/UserRoutes')(app);
require('./app/routes/MedicineReminderRoutes')(app);
require('./app/routes/AppointmentReminderRoutes')(app);
require('./app/routes/MedicalJournalNoteRoutes')(app);
require('./app/routes/GenerateSendPdfRoutes')(app);
require('./app/routes/HelpSupportRoutes')(app);
require('./app/routes/GetOTPRoutes')(app);
require('./app/routes/GetNotificationRoutes')(app);
require('./app/routes/PDFDownloadRoutes')(app);


// set port, listen for requests
const PORT = process.env.PORT || 1818;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


