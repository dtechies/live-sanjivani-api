const { UsersModel } = require('../imports');
const constants = require("../imports").constants
let { successCallback } = require("../constants");
let { jwt } = require("../imports");
const dotenv = require("dotenv");
const { raw } = require('express');
const { decode } = require('jsonwebtoken');
dotenv.config();
exports.registerUser = async (req, res, next) => {
    try {
        let usersData={ first_name: req.body.first_name, last_name: req.body.last_name, gender: req.body.gender, email:req.body.email,dob:req.body.dob ,mob_no:req.body.mob_no,language:req.body.language,is_medicine_reminder:req.body.is_medicine_reminder,is_appointment_reminder:req.body.is_appointment_reminder}
        const addUser = await UsersModel.create(usersData);
        if(addUser){
            const user = await UsersModel.findOne({where:{mob_no:req.body.mob_no}},{raw:true});

            const secretKey = process.env.SECRET_JWT || "theseissecret";
            const token = jwt.sign({mob_no: user.mob_no,user_id:user.id},
            secretKey, {
            expiresIn: "24h",
            });
           user.dataValues.token=token;
           return res.json(constants.responseObj(true, 201, constants.messages.UserCreated,false,user))
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
    const Otp=req.body.otp
    console.log(mob_no)
    let user = await UsersModel.findOne({where:{mob_no:mob_no}},{raw:true});
    if (!user) {
        return res.json(constants.responseObj(false, 401, constants.messages.InvalidCredentials))
    };
   if (user.otp==Otp) {
     
    // user matched!
    const secretKey = process.env.SECRET_JWT || "theseissecret";
    const token = jwt.sign({mob_no: user.mob_no,user_id:user.id},
        secretKey, {expiresIn: "24h", } );
    user.dataValues.token=token;
    return res.json(constants.responseObj(true, 200, constants.messages.UserLogin,false,{user }))
    };
};

exports.getReminderOptions = async (req, res, next) => {    
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.replace("Bearer ", "");
        const secretKey = process.env.SECRET_JWT || "theseissecret";
        const decoded = jwt.verify(token, secretKey)

        const userData = await UsersModel.findOne({where:{mob_no:decoded.mob_no},attributes: ['is_medicine_reminder','is_appointment_reminder']},);
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
