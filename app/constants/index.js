const statusTrue = true;
const statusFalse = false;
const successStatusCode = 200;
const existsStatusCode = 409;
const errorStatusCode = 500;
const invalidStatusCode = 401;
const systemError = "System error. Please contact your administrator";

const messages = {
    TokenExpired: "Token has expired",
}

const responseObj = (status = false, statusCode = "500", message = messages.SomethingWentWromg, isTokenExpired = false, data = {}) => {
    return { status, statusCode, message, isTokenExpired, data }
}

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
    messages, responseObj, successCallback, resultCallbacks
}
