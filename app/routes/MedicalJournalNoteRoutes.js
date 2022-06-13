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
    "/add-medical-journal-note",
    auth(),
    medicalJournalNoteController.addMedicalJournalNote
  );

  router.get(
    "/get-user-medical-journal-note",
    auth(),
    medicalJournalNoteController.getMedicalJournalNote
  );
  router.get(
    "/delete-medical-journal-note",
    auth(),
    medicalJournalNoteController.deleteMedicalJournalNote
  );
  app.use("/", router);
};
