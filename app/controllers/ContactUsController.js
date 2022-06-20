const { ContactUsModel } = require("../imports");
const constants = require("../imports").constants;
const { S3 } = require("../imports");
const dotenv = require("dotenv");
dotenv.config();
const { languageFunc } = require("../i18n/i18n");

exports.addFeedback = async (req, res, next) => {
  let i18n = languageFunc(req.language);
  const user_id = req.user_id;
  try {
    let ContactUsData = {
      user_id: user_id,
      title: req.body.title,
      date: req.body.date,
      note: req.body.note,
    };
    if (req.files) {
      let image_data = req.files.image;
      let filename = image_data.name;
      let imgAttachement = Date.now() + "_" + filename;
      imageUpload(image_data, imgAttachement, async function (err, images) {
        if (err) {
          console.log("err:", err);
        }
      });
      ContactUsData["image"] = imgAttachement;
    }
    const contact_us = await ContactUsModel.create(ContactUsData);
    if (contact_us) {
      return res.json(constants.responseObj(true, 201, i18n.__(`AddSuccess`)));
    } else {
      return res.json(
        constants.responseObj(false, 500, i18n.__(`SomethingWentWrong`))
      );
    }
  } catch (error) {
    console.log(error, "error");
    return res.json(constants.responseObj(false, 500, error.parent));
  }
};

function imageUpload(image, imgAttachement, cb) {
  var params = {
    Bucket: "live-sanjivani",
    ContentEncoding: image.encoding,
    Body: image.data,
    Key: "feedbackImages/" + imgAttachement,
    ContentType: image.mimetype,
    ACL: "public-read",
  };
  S3.upload(params, function (err, data) {
    if (err) {
      console.log(err);
      cb(true, null);
    } else {
      cb(null, {
        image: data.Location.split("/").pop(),
      });
    }
  });
}
