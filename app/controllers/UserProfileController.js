const { UsersModel, OTPModel } = require("../imports");
const constants = require("../imports").constants;
const { S3 } = require("../imports");
const dotenv = require("dotenv");
let { jwt } = require("../imports");
dotenv.config();
const { languageFunc } = require("../i18n/i18n");

exports.editUserProfile = async (req, res, next) => {
  let i18n = languageFunc(req.language);
  const user_id = req.user_id;
  const UserProfileData = await UsersModel.findOne({
    raw: true,
    where: { id: user_id },
  });
  if (UserProfileData) {
    try {
      if (req.body.otp) {
        const OTPData = await OTPModel.findOne({
          where: {
            mob_no: req.body.mob_no,
            country_code: req.body.country_code,
            user_id: user_id,
            id: req.body.otp_id,
          },
        });
        if (`${req.body.otp}` == `${OTPData.otp}`) {
          if (req.files == null) {
            await updateUserProfile(
              user_id,
              req.body,
              UserProfileData,
              OTPData
            ).then(async (value) => {
              const user_profile_data = await getUserProfileData(user_id);
              if (user_profile_data) {
                const secretKey = process.env.SECRET_JWT || "theseissecret";
                const token = jwt.sign(
                  {
                    mob_no: user_profile_data.mob_no,
                    user_id: user_profile_data.id,
                  },
                  secretKey,
                  {
                    expiresIn: "24h",
                  }
                );
                user_profile_data.dataValues.token = token;
                const deleteData = await OTPModel.destroy({
                  where: { id: req.body.otp_id },
                });
                return res.json(
                  constants.responseObj(
                    true,
                    201,
                    i18n.__(`UpdateSuccess`),
                    false,
                    user_profile_data
                  )
                );
              }
            });
          } else {
            var params = {
              Bucket: "live-sanjivani",
              Key: `userProfileImages/${UserProfileData.image}`,
            };
            S3.deleteObject(params, function (err, data) {
              if (err) {
                console.log(err, "err");
              } else {
                console.log("sucessfully deleted images", data);
              }
            });
            await updateUserProfileData(
              req.files.image,
              req.files.image.name,
              user_id,
              req.body,
              UserProfileData
            ).then(async (value) => {
              const user_profile_data = await getUserProfileData(user_id);

              if (user_profile_data) {
                const secretKey = process.env.SECRET_JWT || "theseissecret";
                const token = jwt.sign(
                  {
                    mob_no: user_profile_data.mob_no,
                    user_id: user_profile_data.id,
                  },
                  secretKey,
                  {
                    expiresIn: "24h",
                  }
                );
                user_profile_data.dataValues.token = token;
                const deleteData = await OTPModel.destroy({
                  where: { id: req.body.otp_id },
                });

                return res.json(
                  constants.responseObj(
                    true,
                    201,
                    i18n.__(`UpdateSuccess`),
                    false,
                    user_profile_data
                  )
                );
              }
            });
          }
        } else {
          return res.json(
            constants.responseObj(false, 401, i18n.__(`InvalidOTP`))
          );
        }
      } else {
        if (UserProfileData) {
          try {
            if (req.files == null) {
              await updateUserProfile(user_id, req.body, UserProfileData).then(
                async (value) => {
                  const profile_data = await getUserProfileData(user_id);
                  if (profile_data) {
                    const secretKey = process.env.SECRET_JWT || "theseissecret";
                    const token = jwt.sign(
                      {
                        mob_no: profile_data.mob_no,
                        user_id: profile_data.id,
                      },
                      secretKey,
                      {
                        expiresIn: "24h",
                      }
                    );
                    profile_data.dataValues.token = token;
                    return res.json(
                      constants.responseObj(
                        true,
                        201,
                        i18n.__(`UpdateSuccess`),
                        false,
                        profile_data
                      )
                    );
                  }
                }
              );
            } else {
              var params = {
                Bucket: "live-sanjivani",
                Key: `userProfileImages/${UserProfileData.image}`,
              };
              S3.deleteObject(params, function (err, data) {
                if (err) {
                  console.log(err, "err");
                } else {
                  console.log("sucessfully deleted images", data);
                }
              });
              await updateUserProfileData(
                req.files.image,
                req.files.image.name,
                user_id,
                req.body,
                UserProfileData
              ).then(async (value) => {
                const user_data = await getUserProfileData(user_id);
                if (user_data) {
                  const secretKey = process.env.SECRET_JWT || "theseissecret";
                  const token = jwt.sign(
                    {
                      mob_no: user_data.mob_no,
                      user_id: user_data.id,
                    },
                    secretKey,
                    {
                      expiresIn: "24h",
                    }
                  );
                  user_data.dataValues.token = token;
                  return res.json(
                    constants.responseObj(
                      true,
                      201,
                      i18n.__(`UpdateSuccess`),
                      false,
                      user_data
                    )
                  );
                }
              });
            }
          } catch (error) {
            console.log(error, "error");
            return res.json(constants.responseObj(false, 500, error.parent));
          }
        }
      }
    } catch (error) {
      console.log(error, "error");
      return res.json(
        constants.responseObj(false, 409, i18n.__(`DuplicateNumber`))
      );
    }
  } else {
    return res.json(constants.responseObj(false, 404, i18n.__(`UserNotFound`)));
  }
};

async function updateUserProfile(user_id, body, UserProfileData, OTPData) {
  let profileData = {
    first_name: body.first_name,
    last_name: body.last_name,
    gender: body.gender,
    dob: body.dob,
    email: body.email,
    language: body.language,
  };
  body.otp ? (profileData.otp = body.otp) : "";
  body.mob_no ? (profileData.mob_no = body.mob_no) : "";
  let UserProfilePicData = await UsersModel.update(profileData, {
    where: { id: user_id },
  });
  if (UserProfilePicData) {
    return;
  }
}
async function updateUserProfileData(
  image,
  name,
  user_id,
  body,
  UserProfileData
) {
  imageUpload(image, name, async function (err, image) {
    if (err) {
      return false;
    }
  });

  try {
    let UserProfilePicData = {
      user_id: user_id,
      first_name: body.first_name,
      last_name: body.last_name,
      gender: body.gender,
      dob: body.dob,
      email: body.email,
      language: body.language,
      image:
        "https://live-sanjivani.s3.us-east-2.amazonaws.com/userProfileImages/" +
        name,
    };
    body.otp ? (UserProfilePicData.otp = body.otp) : "";
    body.mob_no ? (UserProfilePicData.mob_no = body.mob_no) : "";
    const UserProfilePicUpdate = await UsersModel.update(UserProfilePicData, {
      where: { id: UserProfileData.id },
    });
  } catch (error) {
    console.log(error, "error");
    return false;
  }
}
async function getUserProfileData(user_id) {
  const UserProfileData = await UsersModel.findOne({
    where: { id: user_id },
  });
  return UserProfileData;
}

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
      cb(null, { image: data.Location });
    }
  });
}
exports.getUserProfileData = async (req, res, next) => {
  let i18n = languageFunc(req.language);
  try {
    const user_id = req.user_id;
    const UserProfileData = await UsersModel.findOne({
      where: { id: user_id },
    });
    return res.json(
      constants.responseObj(true, 201, i18n.__(`DataFound`), false, {
        UserProfileData,
      })
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, i18n.__(`SomethingWentWrong`))
    );
  }
};
