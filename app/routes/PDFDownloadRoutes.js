module.exports = (app) => {
    const PDFDownloadController = require('../controllers/PDFDownloadController');
     const auth = require("./middleware/auth.middleware");
   
    var router = require('express').Router();
    router.post('/download-PDF',[auth(), PDFDownloadController.PDFDownload]);
     app.use('/', router);
    };
