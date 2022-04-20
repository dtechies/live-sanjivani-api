const {
    MedicalJournalNoteModel,
  
} = require("../imports");
const constants = require("../imports").constants;
const { S3 } = require("../imports");
const dotenv = require("dotenv");
let { jwt } = require("../imports/");
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

        const authHeader = req.headers.authorization;
        const token = authHeader.replace("Bearer ", "");
        const secretKey = process.env.SECRET_JWT || "theseissecret";
        const decoded = jwt.verify(token, secretKey)
        if(!decoded){
            constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
        }

    const MedicalJournalNoteData = await MedicalJournalNoteModel.findOne({where:{user_id:decoded.user_id}});
    if(MedicalJournalNoteData){
        try {
        const EditMedicalJournalNote = await MedicalJournalNoteModel.update({name:req.body.name},{where:{id:MedicalJournalNoteData.id}});

        if (EditMedicalJournalNote) {
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
        }catch (error) {
    console.log(error, "error");
    return res.json(constants.responseObj(false, 500, error.errors[0].message));
  }
    }else{
         try {
        let MedicalJournalNoteData = {
          user_id: decoded.user_id,
          name: req.body.name,
         };
        const MedicalJournalNote = await MedicalJournalNoteModel.create(
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
      }
    catch (error) {
    console.log(error, "error");
    return res.json(constants.responseObj(false, 500, error.errors[0].message));
  }
    }
 
};




