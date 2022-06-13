module.exports = (app) => {
  const medicalJournalNoteController = require("../controllers/MedicalJournalNoteController");
  const auth = require("./middleware/auth.middleware");

  var router = require("express").Router();
  router.get(
    "/get-medical-journal-note",
    auth(),
    medicalJournalNoteController.getMedicalJournalNoteList
  );
  router.post(
    "/add-edit-medical-journal-note",
    auth(),
    medicalJournalNoteController.addEditMedicalJournalNote
  );

  router.get(
    "/get-user-medical-journal-note",
    auth(),
    medicalJournalNoteController.getMedicalJournalNote
  );
  app.use("/", router);
};
