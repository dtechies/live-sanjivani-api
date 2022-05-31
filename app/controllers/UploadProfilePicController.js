const { UsersModel } = require("../imports");
const constants = require("../imports").constants;
const { S3 } = require("../imports");
const dotenv = require("dotenv");
let { jwt } = require("../imports/");
dotenv.config();

exports.getUserProfileData = async (req, res, next) => {
  try {
    const UserProfileData = await UsersModel.findAll();

    return res.json(
      constants.responseObj(true, 201, constants.messages.DataFound, false, {
        UserProfileData,
      })
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
    );
  }
};

exports.addEditUserProfilePic = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.replace("Bearer ", "");
  const secretKey = process.env.SECRET_JWT || "theseissecret";
  const decoded = jwt.verify(token, secretKey);
  if (!decoded) {
    constants.responseObj(false, 500, constants.messages.SomethingWentWrong);
  }

  const UserProfilePic = await UsersModel.findOne({
    where: { id: decoded.user_id },
  });
  if (UserProfilePic) {
    try {
      if (req.files == null) {
        const EditUserProfilePic = await UsersModel.update(
          {
            image: req.body.image,
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
          Key: ` userProfilePic/${UserProfilePic.image}`,
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
                  id: decoded.user_id,
                  image: image.image,
                };
                const UserProfilePicUpdate = UsersModel.update(
                  UserProfilePicData,
                  { where: { id: UserProfilePic.id } }
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
                return res.json(
                  constants.responseObj(false, 500, error.errors[0].message)
                );
              }
            }
          }
        );
      }
    } catch (error) {
      console.log(error, "error");
      return res.json(
        constants.responseObj(false, 500, error.errors[0].message)
      );
    }
  } else {
    imageUpload(req.files.image, req.files.image.name, function (err, image) {
      if (err) {
        req.session.error = imports.constants.messages.InvalidFile;
      } else {
        try {
          let UserProfilePicData = {
            id: decoded.user_id,
            image: image.image,
          };
          const UserProfilePic = UsersModel.create(UserProfilePicData);
          if (UserProfilePic) {
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
          return res.json(
            constants.responseObj(false, 500, error.errors[0].message)
          );
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
