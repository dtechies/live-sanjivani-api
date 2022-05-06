const {
  CategoryModel,
  SubcategoryModel,
  FavoriteModel,
  
} = require("../imports");
const constants = require("../imports").constants;
const { S3 } = require("../imports");
let { jwt } = require("../imports/");
const sequelize = require('sequelize');
const db = require('../../app/models');
const {healthPdf}=require('../utils/Utils')
const {sendPdf}=require('../utils/Utils')


var AWS = require('aws-sdk');
 AWS.config.update({
  AWSAccessKeyId:"AKIAWEN5XFEYFIH3IWYR",
  AWSSecretKey:"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",
 region:'us-east-1'
});

 exports.sendMail = async (req, res, next) => {
 
  var sourceEmail=req.body.email

var params = {
 IdentityType: "EmailAddress",
 MaxItems: 20
};

  const authHeader = req.headers.authorization;
        const token = authHeader.replace("Bearer ", "");
        const secretKey = process.env.SECRET_JWT || "theseissecret";
        const decoded = jwt.verify(token, secretKey)
        if(!decoded){
            constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
        }

       try{
       
         //let subCategoryfav= await FavoriteModel.findAll( {attributes: ['subcategory_id'],group: ['subcategory_id'], where:{user_id:decoded.user_id},raw:true })
         //let obj=[]
        //  for(let i=0;i<subCategoryfav.length;i++){
        //     obj.push(subCategoryfav[i].subcategory_id)
        //  }
        //  console.log(obj)
         let categoryData = await CategoryModel.findAll({where:{id:req.body.category_id}},
          
        {  include: [
          {
          model:SubcategoryModel,
          include:[ {model : FavoriteModel,where:{user_id:decoded.user_id},order: [['id', 'DESC']],attributes: ['value'],limit:1
        }]
         }
        ],
        order: [['id', 'DESC']],
     });
    let pdf = await healthPdf(categoryData)
 
     if (!sourceEmail==""){

      var listIDsPromise = await new AWS.SES({apiVersion: '2010-12-01'}).listIdentities(params).promise();
    
     let verified =listIDsPromise.Identities

     verified.includes(sourceEmail)
       
     if(verified.includes(sourceEmail)==true){
       sendPdf(req.body.email,pdf)
     }
     else{
        // Create promise and SES service object
        var verifyEmailPromise =await new AWS.SES({apiVersion: '2010-12-01'}).verifyEmailIdentity({EmailAddress: sourceEmail}).promise();
     }
    if(verifyEmailPromise){
      sendPdf(req.body.email,pdf)
    }
 
    return res.json(constants.responseObj(true, 201, constants.messages.DataFound, false, {categoryData, }));
  } 
 
}catch (error) {
    console.log(error, "error");
    return res.json(constants.responseObj(false, 500, constants.messages.SomethingWentWrong));
  }
}

