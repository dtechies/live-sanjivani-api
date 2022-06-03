const { UsersModel } = require("../imports");
const constants = require("../imports").constants;
const { S3 } = require("../imports");
const dotenv = require("dotenv");
let { jwt } = require("../imports/");
dotenv.config();

exports.addEditUserProfilePic = async (req, res, next) => {
  const user_id = req.user_id;

  const UserProfilePic = await UsersModel.findOne({
    where: { id: user_id },
  });
  if (UserProfilePic) {
    try {
      if (req.files == null) {
        const EditUserProfileData = await UsersModel.update(
          {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            gender: req.body.gender,
            dob: req.body.dob,
            email: req.body.email,
            mob_no: req.body.mob_no,
            language: req.body.language,
            otp: req.body.otp,
          },
          { where: { id: UserProfilePic.id } }
        ).then((result) => {
          return res.json(
            constants.responseObj(true, 201, constants.messages.AddSuccess)
          );
        });
      } else {
        var params = {
          Bucket: "live-sanjivani",
          Key: `userProfileImages/${UserProfilePic.image}`,
        };
        S3.deleteObject(params, function (err, data) {
          if (err) {
            console.log(err, "err");
          } else {
            console.log("sucessfully deleted images", data);
          }
        });
        imageUpload(
          req.files.image,
          req.files.image.name,
          function (err, image) {
            if (err) {
              return res.json(
                constants.responseObj(false, 500, error.errors[0].message)
              );
            } else {
              try {
                let UserProfilePicData = {
                  user_id: user_id,
                  first_name: req.body.first_name,
                  last_name: req.body.last_name,
                  gender: req.body.gender,
                  dob: req.body.dob,
                  email: req.body.email,
                  mob_no: req.body.mob_no,
                  language: req.body.language,
                  image: image.image,
                  otp: req.body.otp,
                };
                const UserProfilePicUpdate = UsersModel.update(
                  UserProfilePicData,
                  {
                    where: { id: UserProfilePic.id },
                  }
                );

                if (UserProfilePicUpdate) {
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
                return res.json(constants.responseObj(false, 500, error));
              }
            }
          }
        );
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
          let UserProfileData = {
            user_id: user_id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            gender: req.body.gender,
            dob: req.body.dob,
            email: req.body.email,
            mob_no: req.body.mob_no,
            language: req.body.language,
            otp: req.body.otp,
            image: image.image,
          };
          const UserProfile = UsersModel.create(UserProfileData);
          if (UserProfile) {
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
    Key: "userProfileImages/" + imgAttachement,
    ContentType: image.mimetype,
    ACL: "public-read",
  };
  S3.upload(params, function (err, data) {
    if (err) {
      console.log(err);
      cb(true, null);
    } else {
      cb(null, { image: data.Location.split("/").pop() });
    }
  });
}
