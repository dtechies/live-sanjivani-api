const { MedicalJournalNoteModel } = require("../imports");
const constants = require("../imports").constants;
const { S3 } = require("../imports");
const dotenv = require("dotenv");
dotenv.config();

exports.getMedicalJournalNoteList = async (req, res, next) => {
  try {
    const MedicalJournalNoteData = await MedicalJournalNoteModel.findAll();

    return res.json(
      constants.responseObj(true, 201, constants.messages.DataFound, false, {
        MedicalJournalNoteData,
      })
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
    );
  }
};
exports.getMedicalJournalNote = async (req, res, next) => {
  try {
    const user_id = req.user_id;
    const MedicalJournalNoteData = await MedicalJournalNoteModel.findAll({
      where: { user_id: user_id },
    });

    return res.json(
      constants.responseObj(true, 201, constants.messages.DataFound, false, {
        MedicalJournalNoteData,
      })
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
    );
  }
};

exports.addEditMedicalJournalNote = async (req, res, next) => {
  const user_id = req.user_id;
  const MedicalJournalNote = await MedicalJournalNoteModel.findOne({
    where: {
      user_id: user_id,
    },
  });
  if (MedicalJournalNote) {
    try {
      if (req.files == null) {
        const EditMedicalJournalNote = await MedicalJournalNoteModel.update(
          {
            time: req.body.time,
            date: req.body.date,
            description: req.body.description,
          },
          {
            where: {
              id: MedicalJournalNote.id,
            },
          }
        ).then((result) => {
          return res.json(
            constants.responseObj(true, 201, constants.messages.AddSuccess)
          );
        });
      } else {
        var params = {
          Bucket: "live-sanjivani",
          Key: `medicalJournalNoteImages/${MedicalJournalNote.image}`,
        };
        S3.deleteObject(params, function (err, data) {
          if (err) {
            console.log(err, "err");
          } else {
          }
        });
        imageUpload(
          req.files.image,
          req.files.image.name,
          function (err, image) {
            if (err) {
              return res.json(constants.responseObj(false, 500, error.parent));
            } else {
              try {
                let MedicalJournalNoteData = {
                  user_id: user_id,

                  time: req.body.time,
                  date: req.body.date,
                  description: req.body.description,
                  image: image.image,
                };
                const medicalJournalNoteUpdate = MedicalJournalNoteModel.update(
                  MedicalJournalNoteData,
                  {
                    where: {
                      id: MedicalJournalNote.id,
                    },
                  }
                );
                if (medicalJournalNoteUpdate) {
                  return res.json(
                    constants.responseObj(
                      true,
                      201,
                      constants.messages.AddSuccess
                    )
                  );
                } else {
                  return res.json(
                    constants.responseObj(
                      false,
                      500,
                      constants.messages.SomethingWentWrong
                    )
                  );
                }
              } catch (error) {
                console.log(error, "error");
                return res.json(
                  constants.responseObj(false, 500, error.parent)
                );
              }
            }
          }
        );
      }
    } catch (error) {
      console.log(error, "error");
      return res.json(constants.responseObj(false, 500, error.parent));
    }
  } else {
    await imageUpload(
      req.files.image,
      req.files.image.name,
      async function (err, image) {
        if (err) {
          req.session.error = imports.constants.messages.InvalidFile;
        } else {
          try {
            let MedicalJournalNoteData = {
              user_id: user_id,

              time: req.body.time,
              date: req.body.date,
              description: req.body.description,
              image: image.image,
            };
            const MedicalJournalNote = MedicalJournalNoteModel.create(
              MedicalJournalNoteData
            );
            if (MedicalJournalNote) {
              return res.json(
                constants.responseObj(true, 201, constants.messages.AddSuccess)
              );
            } else {
              return res.json(
                constants.responseObj(
                  false,
                  500,
                  constants.messages.SomethingWentWrong
                )
              );
            }
          } catch (error) {
            console.log(error, "error");
            return res.json(constants.responseObj(false, 500, error.parent));
          }
        }
      }
    );
  }
};

async function imageUpload(image, imgAttachement, cb) {
  var params = {
    Bucket: "live-sanjivani",
    ContentEncoding: image.encoding,
    Body: image.data,
    Key: "medicalJournalNoteImages/" + imgAttachement,
    ContentType: image.mimetype,
    ACL: "public-read",
  };
  await S3.upload(params, function (err, data) {
    if (err) {
      console.log(err);
      cb(true, null);
    } else {
      cb(null, {
        image: data.Location,
      });
    }
  });
}
