const {
  MedicalJournalNoteModel,

} = require("../imports");
const constants = require("../imports").constants;
const {
  S3
} = require("../imports");
const dotenv = require("dotenv");
let {
  jwt
} = require("../imports/");
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

exports.addEditMedicalJournalNote = async (req, res, next) => {


  const MedicalJournalNote = await MedicalJournalNoteModel.findOne({
    where: {
      user_id: user_id
    }
  });
  if (MedicalJournalNote) {
    try {
      if (req.files == null) {
        const EditMedicalJournalNote = await MedicalJournalNoteModel.update({
          time: req.body.time,
          description: req.body.description,
          image: req.body.image
        }, {
          where: {
            id: MedicalJournalNote.id
          }
        }).then((result) => {
          return res.json(constants.responseObj(true, 201, constants.messages.AddSuccess));
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
            console.log("sucessfully deleted images", data);
          }
        });
        imageUpload(req.files.image, req.files.image.name, function (err, image) {
          if (err) {
            return res.json(constants.responseObj(false, 500, error));
          } else {

            try {
              let MedicalJournalNoteData = {
                user_id: user_id,
                // name: req.body.name,
                time: req.body.time,
                description: req.body.description,
                image: image.image,

              };
              const medicalJournalNoteUpdate = MedicalJournalNoteModel.update(MedicalJournalNoteData, {
                where: {
                  id: MedicalJournalNote.id
                }
              });
              if (medicalJournalNoteUpdate) {
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
              return res.json(constants.responseObj(false, 500, error));
            }
          }

        });

      }
    } catch (error) {
      console.log(error, "error");
      return res.json(constants.responseObj(false, 500, error));
    }
  } else {

    imageUpload(req.files.image, req.files.image.name, function (err, image) {
      if (err) {
        req.session.error = imports.constants.messages.InvalidFile;
      } else {

        try {
          let MedicalJournalNoteData = {
            user_iduser_id,
            // name: req.body.name,
            time: req.body.time,
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
          return res.json(constants.responseObj(false, 500, error));
        }
      }

    });

  }

};

function imageUpload(image, imgAttachement, cb) {
  var params = {
    Bucket: "live-sanjivani",
    ContentEncoding: image.encoding,
    Body: image.data,
    Key: "medicalJournalNoteImages/" + imgAttachement,
    ContentType: image.mimetype,
    ACL: "public-read",
  };
  S3.upload(params, function (err, data) {
    if (err) {
      console.log(err);
      cb(true, null);
    } else {
      cb(null, {
        image: data.Location.split("/").pop()
      });
    }
  });
}
