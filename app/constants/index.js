const statusTrue = true;
const statusFalse = false;
const successStatusCode = 200;
const existsStatusCode = 409;
const errorStatusCode = 500;
const invalidStatusCode = 401;
const systemError = "System error. Please contact your administrator";

const messages = {
  SomethingWentWrong: "Something Went Wrong!",
  TokenExpired: "Token has expired",
  NoLanguage: "No Language Found.",
  NoCategory: "No Category Found.",
  NoSubCategory: "No SubCategory Found.",
  NoFavorites: "USer Favorite List Not Found.",
  SomethingWentWrong: "Something Went Wrong!",
  Success: "Record Found.",
  UserCreated: "User Created Successfully.",
  InvalidCredentials: "Invalid Credentials!",
  UserLogin: "User Login successfully.",
  AccessDenied: "Access denied. No credentials sent!",
  Authorization: "Authentication failed!",
  InvalidToken: "Invalid Token!",
  DataFound: "Data Found.",
  UpdateStatus: "Status Updated.",
  AddSuccess: "Data Added Successfully.",
  InvalidFile: "Invalid File!",
  NoNestedSubcategory: "No SubCategory Found.",
  Message: "Sample message for Android endpoints",
  Title: "Sample message for Android endpoints",
  Subject: "back end Notification",
};

const responseObj = (
  status = false,
  statusCode = "500",
  message = messages.SomethingWentWrong,
  isTokenExpired = false,
  data = {}
) => {
  return { status, statusCode, message, isTokenExpired, data };
};

const successCallback = { status: statusTrue, statusCode: successStatusCode };
const resultCallbacks = {
  existsCallBack: { status: statusFalse, statusCode: existsStatusCode },
  systemErrorCallback: {
    status: statusFalse,
    statusCode: errorStatusCode,
    message: systemError,
  },
  invalidCredentialsCallback: {
    status: statusFalse,
    statusCode: invalidStatusCode,
  },
};

module.exports = {
  messages,
  responseObj,
  successCallback,
  resultCallbacks,
};
