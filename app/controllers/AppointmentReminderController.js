const {
  DoctorsModel,
  AppointmentReminderModel,
  
} = require("../imports");
const constants = require("../imports").constants;
const { S3 } = require("../imports");
const dotenv = require("dotenv");
let { jwt } = require("../imports/");
dotenv.config();

exports.addAppointmentReminderView = async (req, res, next) => {
  try {
    
    //const AppointmentData = await AppointmentReminderModel.findAll();
    //console.log(AppointmentData,"AppointmentData--------------------------")
    const DoctorsData = await DoctorsModel.findAll();
    
    return res.json(
      constants.responseObj(true, 201, constants.messages.DataFound, false, {
        //AppointmentData,
        DoctorsData,
      })
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
    );
  }
};


exports.getAppointmentReminderProfile = async (req, res, next) => {
    const authHeader = req.headers.authorization;
        const token = authHeader.replace("Bearer ", "");
        const secretKey = process.env.SECRET_JWT || "theseissecret";
        const decoded = jwt.verify(token, secretKey)
        console.log("decoded logg",decoded)
        if(!decoded){
            constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
        }
  try {
    const AppointmentReminderProfileData = await AppointmentReminderModel.findAll({where:{user_id:decoded.user_id}});
   
    return res.json(
      constants.responseObj(true, 201, constants.messages.DataFound, false, {
        AppointmentReminderProfileData,      
      })
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
    );
  }
};

exports.editAppointmentReminderStatus = async (req, res, next) => {
  try {
    let editAppointmentStatus = await AppointmentReminderModel.update(
      { status: req.body.status },
      { where: { id: req.body.id } }
    );

    return res.json(
      constants.responseObj(true, 201, constants.messages.UpdateStatus, false)
    );
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
    );
  }
};

exports.addAppointmentReminder = async (req, res, next) => {
  const DoctorData = await DoctorsModel.findOne({where:{doctor_name:req.body.doctor_name,speciality:req.body.speciality}});
  console.log("found  DoctorData----",DoctorData)
   if(DoctorData){
  let Doctor_id=DoctorData.id
  console.log("found doc id----",Doctor_id)
   }else{
  
    const DoctorData = await DoctorsModel.create({doctor_name:req.body.doctor_name,speciality:req.body.speciality});
    console.log("created  DoctorData----",DoctorData) 
      if(!DoctorData){
         return res.json(constants.responseObj(false,500,constants.messages.SomethingWentWrong));
        }
        const DoctorId = await DoctorsModel.findOne({where:{doctor_name:req.body.doctor_name,speciality:req.body.speciality}});
       var Doctor_id = DoctorId.id
        console.log("found doc id after created----",Doctor_id)
    }

       try {
          let AppointmentReminderData = {
          user_id: req.body.user_id,
          doctor_id: Doctor_id,
          address1: req.body.address1,
          address2: req.body.address2,
          date: req.body.date,
          city: req.body.city,
          state: req.body.state,
          pincode: req.body.pincode,
          user_selected_time: req.body.user_selected_time,
          status: true,
        };
        const AppointmentReminder = await AppointmentReminderModel.create(
          AppointmentReminderData
        );
        if (AppointmentReminder) {
          return res.json(
            constants.responseObj(true, 201, constants.messages.AddSuccess)
          );
        } else {
          return res.json(
            constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
          );
        }
      }
    catch (error) {
    console.log(error, "error");
    return res.json(constants.responseObj(false, 500, error.errors[0].message));
  }
};

exports.addMedicineReminder = async (req, res, next) => {
  try {
    let medicine_image = req.files.medicine_image;
    let filename = medicine_image.name;
    let imgAttachement = Date.now() + "_" + filename;
    console.log(imgAttachement, "imgAttachement loggg");
    imageUpload(medicine_image, imgAttachement, async function (err, images) {
      if (err) {
        console.log(err, "err logg");
        return res.json(
          constants.responseObj(false, 422, constants.messages.InvalidFile)
        );
      } else {
        let medicineReminderData = {
          user_id: req.body.user_id,
          referred_by_doctor: req.body.referred_by_doctor,
          medicine_name: req.body.medicine_name,
          medicine_image: images.image,
          medicine_form: req.body.medicine_form,
          dose: req.body.dose,
          medicine_strength: req.body.medicine_strength,
          medicine_strength_unit: req.body.medicine_strength_unit,
          reminder_frequency: req.body.reminder_frequency,
          frequency_value: req.body.frequency_value,
          reminder_time: req.body.reminder_time,
          user_selected_time: req.body.user_selected_time,
          pills_remaining: req.body.pills_remaining,
          status: true,
        };
        const medicineReminder = await MedicineReminderModel.create(
          medicineReminderData
        );
        console.log(medicineReminder, "medicineReminder log");
        if (medicineReminder) {
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
      }
    });
  } catch (error) {
    console.log(error, "error");
    return res.json(constants.responseObj(false, 500, error.errors[0].message));
  }
};

