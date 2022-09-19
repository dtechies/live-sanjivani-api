const { UsersModel, OTPModel,Op } = require("../imports");
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
        if (`${req.body.otp}` == `${UserProfileData.otp}`) {
          if (req.files == null) {
            await updateUserProfile(
              user_id,
              req.body,
              UserProfileData,
              i18n
            ).then(async (value) => {
              if(value){
                return res.json(
                  constants.responseObj(false, 409, value)
                );
              }
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
                    expiresIn: "30d",
                  }
                );

                const refreshTokenSecretKey = process.env.REFRESH_SECRET_KEY;
                const refreshToken = jwt.sign(
                  {
                    mob_no: user_profile_data.mob_no,
                    user_id: user_profile_data.id,
                  },
                  refreshTokenSecretKey,
                  {
                    expiresIn: "365d",
                  }
                );
                const tokenTime = jwt.verify(token, secretKey);
                const refreshTokenTime = jwt.verify(
                  refreshToken,
                  refreshTokenSecretKey
                );

                user_profile_data.dataValues.token = token;
                user_profile_data.dataValues.refreshToken = refreshToken;
                user_profile_data.dataValues.tokenTime = tokenTime.exp;
                user_profile_data.dataValues.refreshTokenTime =
                  refreshTokenTime.exp;
                // const deleteData = await OTPModel.destroy({
                //   where: { id: req.body.otp_id },
                // });
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
              UserProfileData,
              i18n
            ).then(async (value) => {
              if(value){
                return res.json(
                  constants.responseObj(false, 409, value)
                );
              }
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
                    expiresIn: "30d",
                  }
                );
                const refreshTokenSecretKey = process.env.REFRESH_SECRET_KEY;
                const refreshToken = jwt.sign(
                  {
                    mob_no: user_profile_data.mob_no,
                    user_id: user_profile_data.id,
                  },
                  refreshTokenSecretKey,
                  {
                    expiresIn: "365d",
                  }
                );
                const tokenTime = jwt.verify(token, secretKey);
                const refreshTokenTime = jwt.verify(
                  refreshToken,
                  refreshTokenSecretKey
                );

                user_profile_data.dataValues.token = token;
                user_profile_data.dataValues.refreshToken = refreshToken;
                user_profile_data.dataValues.tokenTime = tokenTime.exp;
                user_profile_data.dataValues.refreshTokenTime =
                  refreshTokenTime.exp;
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
      } else{
        if (req.files == null) {
          await updateUserProfile(
            user_id,
            req.body,
            UserProfileData,
            i18n
          ).then(async (value) => {
            if(value){
              return res.json(
                constants.responseObj(false, 409, value)
              );
            }
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
                  expiresIn: "30d",
                }
              );

              const refreshTokenSecretKey = process.env.REFRESH_SECRET_KEY;
              const refreshToken = jwt.sign(
                {
                  mob_no: user_profile_data.mob_no,
                  user_id: user_profile_data.id,
                },
                refreshTokenSecretKey,
                {
                  expiresIn: "365d",
                }
              );
              const tokenTime = jwt.verify(token, secretKey);
              const refreshTokenTime = jwt.verify(
                refreshToken,
                refreshTokenSecretKey
              );

              user_profile_data.dataValues.token = token;
              user_profile_data.dataValues.refreshToken = refreshToken;
              user_profile_data.dataValues.tokenTime = tokenTime.exp;
              user_profile_data.dataValues.refreshTokenTime =
                refreshTokenTime.exp;
          
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
            UserProfileData,
            i18n
          ).then(async (value) => {
            if(value){
              return res.json(
                constants.responseObj(false, 409, value)
              );
            }
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
                  expiresIn: "30d",
                }
              );
              const refreshTokenSecretKey = process.env.REFRESH_SECRET_KEY;
              const refreshToken = jwt.sign(
                {
                  mob_no: user_profile_data.mob_no,
                  user_id: user_profile_data.id,
                },
                refreshTokenSecretKey,
                {
                  expiresIn: "365d",
                }
              );
              const tokenTime = jwt.verify(token, secretKey);
              const refreshTokenTime = jwt.verify(
                refreshToken,
                refreshTokenSecretKey
              );

              user_profile_data.dataValues.token = token;
              user_profile_data.dataValues.refreshToken = refreshToken;
              user_profile_data.dataValues.tokenTime = tokenTime.exp;
              user_profile_data.dataValues.refreshTokenTime =
                refreshTokenTime.exp;
          
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

async function updateUserProfile(user_id, body, UserProfileData, i18n) {
  let profileData = {
    first_name: body.first_name,
    last_name: body.last_name,
    gender: body.gender,
    dob: body.dob,
    language: body.language,
  };
  let mob = body.mob_no || null;
  if(mob && typeof mob !== 'undefined'){
    let findMob = await UsersModel.findAll({
      where: { mob_no: mob , id:{[Op.ne]: user_id} },
    });
    if(findMob.length){
      return i18n.__(`mobExists`)
    }
    profileData.mob_no = mob;
    profileData.country_code = body.country_code;
  }
  let findEmail = await UsersModel.findAll({
    where: { email: body.email , id:{[Op.ne]: user_id} },
  });
  if(findEmail.length){
    return i18n.__(`emailExists`)
  }
  profileData.email = body.email;
  let UserProfilePicData = await UsersModel.update(profileData, {
    where: { id: user_id },
  });
  if (UserProfilePicData) {
    return null;
  }
}

async function updateUserProfileData(
  image,
  name,
  user_id,
  body,
  UserProfileData,
  i18n
) {
  imageUpload(image, name, async function (err, image) {
    if (err) {
      return false;
    }
  });

  try {
    let mob = body.mob_no || null;
    let UserProfilePicData = {
      first_name: body.first_name,
      last_name: body.last_name,
      gender: body.gender,
      dob: body.dob,
      language: body.language,
      image:
        "https://live-sanjivani.s3.us-east-2.amazonaws.com/userProfileImages/" +
        name,
    };
    if(mob && typeof mob !== 'undefined'){
      let findMob = await UsersModel.findAll({
        where: { mob_no: mob , id:{[Op.ne]: user_id} },
      });
      if(findMob.length){
        return i18n.__(`mobExists`)
      }
      UserProfilePicData.mob_no = mob;
      UserProfilePicData.country_code = body.country_code;
    } 
    let findEmail = await UsersModel.findAll({
      where: { email: body.email , id:{[Op.ne]: user_id} },
    });
    if(findEmail.length){
      return i18n.__(`emailExists`)
    }
    UserProfilePicData.email = body.email;
    const UserProfilePicUpdate = await UsersModel.update(UserProfilePicData, {
      where: { id: user_id },
    });
    return null;
  } catch (error) {
    return i18n.__(`errorUpdateProfile`);
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
