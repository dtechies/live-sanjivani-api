const jwt = require("jsonwebtoken");
const options = {
  expiresIn: "60d",
  issuer: "",
};
const Cryptr = require("cryptr");
const algorithm = new Cryptr("sanjivani#$&&codentic@$$");
const sgMail = require("@sendgrid/mail");
const ejs = require("ejs");
const fs = require("fs");
var pdf = require("html-pdf");
const { S3 } = require("../imports");
var AWS = require("aws-sdk");
const { moment } = require("../imports");

var bcrypt;
try {
  // Try the native module first
  bcrypt = require("bcrypt");
  // Browserify returns an empty object
  if (bcrypt && typeof bcrypt.compare !== "function") {
    bcrypt = require("bcryptjs");
  }
} catch (err) {
  // Fall back to pure JS impl
  bcrypt = require("bcryptjs");
}
hashPassword = (password, cb) => {
  bcrypt.genSalt(10, function (err, salt) {
    if (err) cb(err);
    bcrypt.hash(password, salt, function (err, hash) {
      if (err)
        cb(err, {
          message: "error occured",
          password: "",
        });
      else
        cb(null, {
          message: "successful",
          password: hash,
        });
    });
  });
};
const comparePassword = async (plainPassword, hash) => {
  try {
    let result = await bcrypt.compare(plainPassword, hash);
    result = JSON.parse(JSON.stringify(result));

    return result;
  } catch (error) {
    console.log(error);

    return false;
  }
};

validations = (requestData, schema, cb) => {
  let keys = Object.keys(requestData);

  let temp_array = [];
  for (var i in schema) {
    if (
      !keys.includes(schema[i]) ||
      requestData[schema[i]] == null ||
      requestData[schema[i]] == undefined
    )
      temp_array.push(schema[i].toUpperCase().replace(/_/g, " "));
  }
  if (temp_array.length > 0) {
    let adverb = temp_array.length > 1 ? " are" : " is";
    let message = temp_array + adverb + " missing";
    cb(message);
  } else cb(null, true);
};

function verifyToken(token, callback) {
  jwt.verify(token, process.env.JWT_SECRET, options, function (err, res) {
    callback(err, res);
  });
}
const token = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

response = (status, statusCode, is_token_expired, message) => {
  return {
    result: {
      status,
      statusCode,
      is_token_expired,
      message,
    },
  };
};
systemError = () => {
  return {
    result: {
      status: false,
      statusCode: 500,
      is_token_expired: false,
      message: "System error, please contact administrator",
    },
  };
};

validateHeaders = (requestData, schema, cb) => {
  let keys = Object.keys(requestData);

  let temp_array = [];
  for (var i in schema) {
    if (
      !keys.includes(schema[i]) ||
      requestData[schema[i]] == null ||
      requestData[schema[i]] == undefined
    )
      temp_array.push(schema[i].toUpperCase().replace(/_/g, " "));
  }
  if (temp_array.length > 0) {
    let adverb = temp_array.length > 1 ? " are" : " is";
    let message = temp_array + adverb + " missing";
    cb(message);
  } else cb(null, true);
};

arrayValidatior = (requestData, schema, cb) => {
  let temp_array = [];
  if (requestData.length > 0) {
    for (var index in requestData) {
      let keys = Object.keys(requestData[index]);
      for (var i in schema) {
        if (
          !keys.includes(schema[i]) ||
          requestData[index][schema[i]] == null ||
          requestData[index][schema[i]] == undefined
        )
          temp_array.push(schema[i].toUpperCase().replace(/_/g, " "));
      }
    }
    if (temp_array.length > 0) {
      let adverb = temp_array.length > 1 ? " are" : " is";
      let message = temp_array + adverb + " missing";
      cb(message);
    } else cb(null, true);
  } else {
    cb("Empty array");
  }
};

const encryptData = (text) => {
  return algorithm.encrypt(text);
};
const decryptData = (text) => {
  return algorithm.decrypt(text);
};

function generateReferralString(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function healthPdf(CategoryData, moment) {
  let compiled = ejs.compile(
    fs.readFileSync(__dirname.slice(0, -5) + "views/CategoriesPdf.ejs", "utf8")
  );
  CategoryData.forEach((element) => {
    element.user_subcategories_values.forEach((values) => {
      let result = values.value.includes("{");
      if (result) {
        result = values.value.slice(1, values.value.length - 1);
      }
      result ? (values.value = result.replaceAll("'", "")) : "";
    });
  });
  let html = compiled({
    title: "EJS",
    CategoryData: CategoryData,
    moment: moment,
  });
  var options = {
    format: "A4",
    header: {
      height: "10mm",
    },
    footer: {
      height: "10mm",
    },
  };
  let generatedPdf = await createPdf(html, options);
  return generatedPdf;
}

const createPdf = (html, options) => {
  return new Promise(function (resolve, reject) {
    pdf.create(html, options).toStream(async (err, result) => {
      if (err) {
        console.log("err:", err);
      }

      let stream = result.pipe(
        fs.createWriteStream(__dirname.slice(0, -5) + "healthpdf/health.pdf")
      );
      stream.on("finish", async () => {
        let uploadedData = await uploadPdf();
        resolve(uploadedData);
      });
    });
  });
};
const uploadPdf = () => {
  return new Promise(function (resolve, reject) {
    let pdfAttachement = `${generateReferralString(10)}.pdf`;
    let params = {
      Bucket: "live-sanjivani",
      Body: fs.readFileSync(__dirname.slice(0, -5) + "healthpdf/health.pdf"),
      Key: "userFavouriteCategoryPDF/" + pdfAttachement,
      ContentType: "application/pdf",
      ACL: "public-read",
    };
    S3.upload(params, async function (err, data) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        // fs.stat(
        //   __dirname.slice(0, -5) + "healthpdf/" + pdfAttachement,
        //   function (err, stats) {
        //     if (err) {
        //       return console.error(err);
        //     }
        //   }
        // );
        resolve(pdfAttachement);
      }
    });
  });
};
async function sendPdf(email, pdf) {
  const ses = new AWS.SES({
    AWSAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    AWSSecretKey: process.env.AWS_SECRET_KEY,
    region: process.env.PDF_REGION,
  });
  // Create sendEmail params
  var params = {
    Destination: {
      /* required */
      CcAddresses: [
        "codentic.users@gmail.com",
        /* more items */
      ],
      ToAddresses: [email] /* more items */,
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: `<h3>Health report</h3>
              <p>Download pdf <a href="https://live-sanjivani.s3.us-east-2.amazonaws.com/userFavouriteCategoryPDF/${pdf}">here</a></p>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "TEXT_FORMAT_BODY",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Test email",
      },
    },
    Source: "codentic.users@gmail.com" /* required */,
    ReplyToAddresses: [
      email,
      /* more items */
    ],
  };
  ses.sendEmail(params, (err, data) => {
    if (err) {
      console.log(err);
      // return res.json(constants.responseObj(true, 201, constants.messages.Success));}
    } else {
      console.log(data);
      //return res.json(constants.responseObj(true, 201, constants.messages.Success));
    }
  });
}

module.exports = {
  validations,
  verifyToken,
  token,
  response,
  systemError,
  validateHeaders,
  arrayValidatior,
  hashPassword,
  comparePassword,
  encryptData,
  decryptData,
  bcrypt,
  jwt,
  healthPdf,
  sendPdf,
};
