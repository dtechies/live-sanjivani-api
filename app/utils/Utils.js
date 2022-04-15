const jwt = require('jsonwebtoken');
const options = { expiresIn: '60d', issuer: '' };
const Cryptr = require('cryptr')
const algorithm = new Cryptr('sanjivani#$&&codentic@$$');
const sgMail = require("@sendgrid/mail");




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
function adminemailtrigger(userdata, html, emailsubject, cb) {
    let sendgrid_api_key = process.env.SENDGRID_API_KEY
    console.log(sendgrid_api_key, 'sendgrid_api_key');
    sgMail.setApiKey(sendgrid_api_key);
    const msg = {
        to: 'example@codentic.com',
        from: "example@codentic.com",
        subject: emailsubject.subject,
        html: html,
    };
    (async () => {
        try {
            await sgMail.send(msg)
                .then((resp) => {
                    // console.log(resp,'resp')
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
    SMS_URL, _copy,singleDiamond, toFloat, BaseUrl,BlogBaseUrl,RingSizerBaseUrl,KnowYourJewelleryBaseUrl,
    CertificationBaseUrl, LandingPageBannerBaseUrl, LandingPageContentBaseUrl,
    LandingPagePromisesBaseUrl,DesignCategoryBaseUrl,SocialMediaBaseUrl, LandingPageEmail
}
