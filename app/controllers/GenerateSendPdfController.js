const {
  CategoryModel,
  SubcategoryModel,
  UserSubcategoriesValueModel,
} = require("../imports");
const constants = require("../imports").constants;
const { AWS } = require("../imports");

const { healthPdf } = require("../utils/Utils");
const { sendPdf } = require("../utils/Utils");

exports.sendMail = async (req, res, next) => {
  var sourceEmail = req.body.email;

  var params = {
    IdentityType: "EmailAddress",
    MaxItems: 20,
  };
  const user_id = req.user_id;
  try {
    let categoryData = await CategoryModel.findAll({
      where: { id: req.body.category_id },
      include: [
        {
          model: SubcategoryModel,
          include: [
            {
              model: UserSubcategoriesValueModel,
              where: { user_id: user_id },
              order: [["id", "DESC"]],
              attributes: ["value"],
              limit: 1,
            },
          ],
        },
      ],
      order: [["id", "DESC"]],
    });

    let pdf = await healthPdf(categoryData);

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

// exports.addFavorites = async (req, res, next) => {
//   const user_id = req.user_id;
//   FavoriteModel.destroy({
//     where: {
//       user_id: user_id,
//     },
//   })
//     .then(async (result) => {
//       let category_data = req.body.category_id;
//       let categoryValue = [];
//       if (category_data) {
//         category_data.forEach((categoryy_id) => {
//           categoryValue.push({
//             user_id: user_id,
//             category_id: category_id,
//           });
//         });
//         const addFavorite = await FavoriteModel.bulkCreate(subcategoryValue);
//         if (addFavorite) {
//           return res.json(
//             constants.responseObj(
//               true,
//               201,
//               constants.messages.AddSuccess,
//               false
//             )
//           );
//         } else {
//           return res.json(
//             constants.responseObj(
//               false,
//               500,
//               constants.messages.SomethingWentWrong
//             )
//           );
//         }
//       } else {
//         constants.responseObj(
//           false,
//           500,
//           constants.messages.SomethingWentWrong
//         );
//       }
//     })
//     .catch((err) => {
//       console.log("err:", err);
//       constants.responseObj(false, 500, constants.messages.SomethingWentWrong);
//     });
// };
