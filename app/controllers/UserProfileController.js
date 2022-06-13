const { UsersModel } = require("../imports");
const constants = require("../imports").constants;
const { S3 } = require("../imports");
const dotenv = require("dotenv");
let { jwt } = require("../imports");
dotenv.config();

exports.editUserProfile = async (req, res, next) => {
  const user_id = req.user_id;
  const UserProfileData = await UsersModel.findOne({
    where: { id: user_id },
  });

  if (UserProfileData) {
    try {
      if (req.body.otp) {
        console.log(req.body.otp, UserProfileData.otp, "2123");
        if (`${req.body.otp}` == `${UserProfileData.otp}`) {
          if (req.files == null) {
            await updateUserProfile(user_id, req.body, UserProfileData).then(
              async (value) => {
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
                  return res.json(
                    constants.responseObj(
                      true,
                      201,
                      constants.messages.UserCreated,
                      false,
                      user_profile_data
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
                return res.json(
                  constants.responseObj(
                    true,
                    201,
                    constants.messages.UserCreated,
                    false,
                    user_profile_data
                  )
                );
              }
            });
          }
        } else {
          return res.json(constants.responseObj(true, 401, "Invalid Otp"));
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
                        constants.messages.UserCreated,
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
                      constants.messages.UserCreated,
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
      return res.json(constants.responseObj(false, 500, error.parent));
    }
  } else {
    return res.json(constants.responseObj(false, 404, "User Not Found"));
  }
};

async function updateUserProfile(user_id, body, UserProfileData) {
  let UserProfilePicData = await UsersModel.update(
    {
      first_name: body.first_name,
      last_name: body.last_name,
      gender: body.gender,
      dob: body.dob,
      email: body.email,
      mob_no: body.mob_no,
      language: body.language,
    },
    { where: { id: user_id } }
  );
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
      mob_no: body.mob_no,
      language: body.language,
      image:
        "https://live-sanjivani.s3.us-east-2.amazonaws.com/userProfileImages/" +
        name,
    };
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
  try {
    const user_id = req.user_id;
    const UserProfileData = await UsersModel.findOne({
      where: { id: user_id },
    });
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
