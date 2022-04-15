const { UsersModel } = require('../imports');
const constants = require("../imports").constants
let { successCallback } = require("../constants");
let { jwt } = require("../utils/Utils");
const dotenv = require("dotenv");
dotenv.config();
exports.registerUser = async (req, res, next) => {
    try {
        let usersData={ first_name: req.body.first_name, last_name: req.body.last_name, gender: req.body.gender, dob:req.body.dob ,mob_no:req.body.mob_no,language:req.body.language,is_medicine_reminder:req.body.is_medicine_reminder,is_appointment_reminder:req.body.is_appointment_reminder}
        const user = await UsersModel.create(usersData);
        console.log(user,"user log")
        if(user){
            return res.json(constants.responseObj(true, 201, constants.messages.UserCreated))
        }else{
            return res.json(constants.responseObj(false, 500, constants.messages.SomethingWentWrong))
        }
    }catch (error) {
        console.log(error, 'error');
        return res.json(constants.responseObj(false, 500, error.errors[0].message))
    }
}

exports.usersLogin = async(req, res, next) => {
    const mob_no=req.body.mob_no
    const user = await UsersModel.findOne({mob_no:mob_no});
    if (!user) {
        return res.json(constants.responseObj(true, 401, constants.messages.InvalidCredentials))
    }

    // user matched!
    const secretKey = process.env.SECRET_JWT || "theseissecret";
    const token = jwt.sign({mob_no: user.mob_no},
        secretKey, {
            expiresIn: "24h",
        }
    );
    return res.json(constants.responseObj(true, 200,false, constants.messages.UserLogin,{user,token }))
};

exports.getReminderOptions = async (req, res, next) => {    
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.replace("Bearer ", "");
        const secretKey = process.env.SECRET_JWT || "theseissecret";
        const decoded = jwt.verify(token, secretKey)

        const userData = await UsersModel.findOne({attributes: ['is_medicine_reminder','is_appointment_reminder']},{where:{mob_no:decoded}});
        if(userData){
            return res.json(constants.responseObj(true, 201, constants.messages.DataFound,false,userData))
        }else{
            return res.json(constants.responseObj(false, 500, constants.messages.SomethingWentWrong))
        }
    }catch (error) {
        console.log(error, 'error');
        return res.json(constants.responseObj(false, 500, constants.messages.SomethingWentWrong))
    }
}
