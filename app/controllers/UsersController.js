const { Users, db, logger, utils, sgMail, ejs, fs, NewsLetter, moment, axios } = require('../imports');
const { token, triggerEmail, bcrypt, _copy } = require("../utils/Utils");
const constants = require("../imports").constants
let { successCallback } = require("../constants");
const http = require("https");

exports.newsLetterEmail = async (req, res, next) => {
    try {
        let requestData = req.body
        let requestHeadear = req.headers.userid
        console.log(requestData,"requestData")
        let whereCondition = {}
        whereCondition = {
            user_id: requestHeadear,
            email: requestData.email
        }
        NewsLetter.findOne({
        where: whereCondition,
        }).then(async (result) => {
            console.log(result,"result")
            result = _copy(result)
            if(!result){
                NewsLetter.create({
                    user_id: requestHeadear,
                    email: requestData.email
                }).then(async(result1)=>{
                    console.log(result1,"result1");
                    let email = result1.email
                    Users.findOne({
                        attributes: ["user_name"],
                        where: {id: requestHeadear}
                    }).then(async (data) => {
                        if(data){
                            console.log(data,"data")
                            var compiled = ejs.compile(fs.readFileSync(__dirname + "/emailTamplates/newslettersubscription.html", "utf8"));
                            var html = compiled({
                            title: "html",
                            username: data.user_name,
                            });
                            subject = {subject: "Thanks for subscribe"} ;
    
                            utils.emailtrigger(email, html, subject, 
                                function (err, emailresult) {
                                    console.log("user email success");
                                }
                            );
                            return res.json({ result: constants.responseObj(true, 200, constants.messages.success, false, result1) })
                        }else{
                            console.log("hee");
                            res.json(utils.response(false, 401, false, constants.messages.dataNotFound))
                        }
                    }).catch((error) => {
                        console.log(error, "------>data");
                        return res.json({ result: constants.responseObj(false, 500, constants.messages.SomethingWentWromg) })
                    });
                }).catch((error) => {
                    console.log(error, "------>reult1");
                    return res.json({ result: constants.responseObj(false, 500, constants.messages.SomethingWentWromg) })
                });
                
            }else {
                console.log("hee");
                res.json(utils.response(false, 401, false, constants.messages.emailExists))
            }
        }).catch((error) => {
            console.log(error, "------>result");
            return res.json({ result: constants.responseObj(false, 500, constants.messages.SomethingWentWromg) })
        });
    }catch (error) {
        console.log(error, 'error');
        logger.error(JSON.stringify(error))
        return res.json({ result: constants.responseObj(false, 500, constants.messages.SomethingWentWromg) })
    }
}
