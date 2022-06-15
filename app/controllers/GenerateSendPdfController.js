const { SubcategoryModel, UserSubcategoriesValueModel } = require("../imports");

const { AWS } = require("../imports");
const { constants, moment } = require("../imports");
const { healthPdf } = require("../utils/Utils");
const { sendPdf } = require("../utils/Utils");

exports.sendMail = async (req, res, next) => {
  var sourceEmail = req.body.email;

  var params = {
    IdentityType: "EmailAddress",
    MaxItems: 20,
  };
  const user_id = req.user_id;
  console.log(user_id, "user_id logg");
  try {
    let categoryData = await SubcategoryModel.findAll({
      where: {
        id: req.body.subcategory_id,
      },

      include: [
        {
          model: UserSubcategoriesValueModel,
          where: {
            user_id: user_id,
          },
          order: [["id", "DESC"]],
          attributes: ["value", "createdAt"],
          limit: 5,
        },
      ],
    });

    let pdf = await healthPdf(categoryData, moment);

    if (!sourceEmail == "") {
      var listIDsPromise = await new AWS.SES({
        apiVersion: "2010-12-01",
      })
        .listIdentities(params)
        .promise();

      let verified = listIDsPromise.Identities;

      verified.includes(sourceEmail);

      if (verified.includes(sourceEmail) == true) {
        sendPdf(req.body.email, pdf);
      } else {
        // Create promise and SES service object
        var verifyEmailPromise = await new AWS.SES({
          apiVersion: "2010-12-01",
        })
          .verifyEmailIdentity({
            EmailAddress: sourceEmail,
          })
          .promise();
      }
      if (verifyEmailPromise) {
        sendPdf(req.body.email, pdf);
      }

      return res.json(
        constants.responseObj(true, 201, constants.messages.DataFound, false, {
          link: `https: //live-sanjivani.s3.us-east-2.amazonaws.com/userFavouriteCategoryPDF/${pdf}`,
          categoryData,
        })
      );
    } else {
      return res.json(
        constants.responseObj(true, 201, constants.messages.DataFound, false, {
          link: `https://live-sanjivani.s3.us-east-2.amazonaws.com/userFavouriteCategoryPDF/${pdf}`,
          categoryData,
        })
      );
    }
  } catch (error) {
    console.log(error, "error");
    return res.json(
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong)
    );
  }
};
