const jwt = require('jsonwebtoken');
const options = { expiresIn: '60d', issuer: '' };
const Cryptr = require('cryptr')
const algorithm = new Cryptr('sanjivani#$&&codentic@$$');
const sgMail = require("@sendgrid/mail");
const ejs = require("ejs");
const fs = require("fs");
var pdf = require('html-pdf');
const { S3 } = require("../imports");

var bcrypt;
try {
    // Try the native module first
    bcrypt = require('bcrypt');
    // Browserify returns an empty object
    if (bcrypt && typeof bcrypt.compare !== 'function') {
        bcrypt = require('bcryptjs');
    }
} catch (err) {
    // Fall back to pure JS impl
    bcrypt = require('bcryptjs');
};
hashPassword = (password, cb) => {
    bcrypt.genSalt(10, function (err, salt) {
        if (err)
            cb(err);
        bcrypt.hash(password, salt, function (err, hash) {
            if (err)
                cb(err, { message: "error occured", password: '' });
            else
                cb(null, { message: "successful", password: hash })
        })
    })
}
const comparePassword = async (plainPassword, hash) => {
    console.log(plainPassword, hash);

    try {
        let result = await bcrypt.compare(plainPassword, hash)
        result = JSON.parse(JSON.stringify(result))
        console.log(result);

        return result
    } catch (error) {
        console.log(error);

        return false
    }
}
// encryptPassword = (password)=>{
//   return cryptr.encrypt(password); 
// }
// decryptedPassword = (encryptedPassword)=>{
//   return cryptr.decrypt(encryptedPassword);
// }
// compareSync = (value1, value2) => {
//   if (value1 == value2) return true
//   return false
// }



validations = (requestData, schema, cb) => {
    let keys = Object.keys(requestData)

    let temp_array = [];
    for (var i in schema) {
        if (!keys.includes(schema[i]) || requestData[schema[i]] == null || requestData[schema[i]] == undefined)
            temp_array.push(schema[i].toUpperCase().replace(/_/g, " "))
    }
    if (temp_array.length > 0) {
        let adverb = temp_array.length > 1 ? " are" : " is"
        let message = temp_array + adverb + " missing"
        cb(message)
    } else
        cb(null, true)

}
function verifyToken(token, callback) {
    console.log(token, process.env.JWT_SECRET);
    console.log(token, "token")
    console.log(process.env.JWT_SECRET, "process.env.JWT_SECRET")
    jwt.verify(token, process.env.JWT_SECRET, options, function (err, res) {
        console.log(res, 'res');
        callback(err, res)
    })
}
const token = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, options);
}

response = (status, statusCode, is_token_expired, message) => {
    return { result: { status, statusCode, is_token_expired, message } }
}
systemError = () => {
    return { result: { status: false, statusCode: 500, is_token_expired: false, message: "System error, please contact administrator" } }
}

validateHeaders = (requestData, schema, cb) => {
    let keys = Object.keys(requestData)

    let temp_array = [];
    for (var i in schema) {
        if (!keys.includes(schema[i]) || requestData[schema[i]] == null || requestData[schema[i]] == undefined)
            temp_array.push(schema[i].toUpperCase().replace(/_/g, " "))
    }
    console.log(temp_array, 'temp_array')
    if (temp_array.length > 0) {
        let adverb = temp_array.length > 1 ? " are" : " is"
        let message = temp_array + adverb + " missing"
        cb(message)
    } else
        cb(null, true)

}

arrayValidatior = (requestData, schema, cb) => {
    let temp_array = [];
    if (requestData.length > 0) {
        for (var index in requestData) {
            let keys = Object.keys(requestData[index])
            for (var i in schema) {
                if (!keys.includes(schema[i]) || requestData[index][schema[i]] == null || requestData[index][schema[i]] == undefined)
                    temp_array.push(schema[i].toUpperCase().replace(/_/g, " "))
            }
        }
        if (temp_array.length > 0) {
            console.log(temp_array)
            let adverb = temp_array.length > 1 ? " are" : " is"
            let message = temp_array + adverb + " missing"
            cb(message)
        } else
            cb(null, true)
    } else {
        cb("Empty array")
    }
}


const encryptData = (text) => {
    return algorithm.encrypt(text)
}
const decryptData = (text) => {
    return algorithm.decrypt(text);
}


function emailtrigger(email, html, emailsubject, cb) {
    let sendgrid_api_key = process.env.SENDGRID_API_KEY
    sgMail.setApiKey(sendgrid_api_key);
    let msg
    msg = {
        to: email,
        from: "hey@example.com",
        subject: emailsubject.subject,
        html: html,
    };
    (async () => {
        try {
            await sgMail.send(msg)
                .then((resp) => {
                    console.log(resp,'resp')
                    cb(null, true);
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (err) {
            console.error(err.toString());
        }
    })();
}

function generateReferralString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

function invoicePdf(CategoryData) {
    console.log(__dirname.slice(0, -5) )
  let compiled = ejs.compile(
    fs.readFileSync(__dirname.slice(0, -5) + "views/CategoriesPdf.ejs", "utf8")
    );
   let html = compiled({title: "EJS", CategoryData: CategoryData});
  var options = {
    format: "A4",
    header: {
      height: "10mm",
    },
    footer: {
      height: "10mm",
    },
  };
  let pdfAttachement =`${generateReferralString(10)}.pdf`
  // `sharingdata.pdf`;
  pdf.create(html, options).toFile(__dirname.slice(0, -5) + "/healthpdf/" + pdfAttachement, (err, result) => {
      pdfData = result;
          var params = {     
            Bucket: "live-sanjivani",
            Body:  fs.readFileSync(
              __dirname.slice(0, -5) + "/healthpdf/" + pdfAttachement
            ),
    
            Key: "userFavouriteCategoryPDF/" + pdfAttachement,
            ContentType: "application/pdf",
            ACL: "public-read",
          };
            S3.upload(params, async function (err, data) {
                if (err) {
                console.log(err);
                } else {
                     console.log(data.Location,'s3path pdf-----------------');
                  fs.stat(
                        __dirname.slice(0, -5)+ "/healthpdf/" + pdfAttachement,
                        function (err, stats) {
                          if (err) {
                            return console.error(err);
                          }
                         fs.unlink(
                            __dirname.slice(0, -5) + "/healthpdf/" + pdfAttachement,
                            function (err) {
                              if (err) return console.log(err);
                              console.log("Pdf File deleted successfully");
                            }
                          );
                        }
                      );
                }
            })
      if (err) {
        console.log(err);
      } else {
        fs.stat( __dirname.slice(0, -5) + "/healthpdf/" + pdfAttachement,
          function (err, stats) {
            if (err) {
              return console.error(err);
            }
          }
        );
      }
    });

 await function downloadPdfS3(fileName,filepath){
    try{
        var params = {
        Bucket: "live-sanjivani",
        Key: "userFavouriteCategoryPDF/" + fileName,};

    res.attachment(Key);
    var fileStream = imports.S3.getObject(params).createReadStream();
    fileStream.pipe(res);

    return 
    }
    catch(err){
        console.log(err,"download pdf error log")

    }
}
}   

   
// const SENDGRID_API_KEY = "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";

//SMS credentials
let smscredentials = {
    "username": "xxxx",
    "password": "xxxx",
    "from": "xxxx"
}
let templateids = {
    otp_template_id: 'xxxx'
}

let SMS_URL = 'https://api.smsu.in/smpp'
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000)
}

//Send Otp function start

//send otp function end
const _copy = e => JSON.parse(JSON.stringify(e))


const toFloat = (number) => { return Number(Number(number).toFixed(2)) }

module.exports = {
    validations, verifyToken, token, response, systemError, validateHeaders, arrayValidatior, hashPassword,
    comparePassword, encryptData, decryptData, emailtrigger, bcrypt, smscredentials, templateids, generateOTP,
    SMS_URL, _copy, toFloat,jwt,invoicePdf
}
