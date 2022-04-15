const constants = require('../constants')
const utils = require('../utils/Utils')
const axios = require('axios')
var moment = require('moment');
const db = require("../models");
const sgMail = require("@sendgrid/mail");
const ejs = require("ejs");
const fs = require("fs");
const AWS = require('aws-sdk')
AWS.config.update({
    accessKeyId: "AKIAWEN5XFEYGB47F6VB",
    secretAccessKey: "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",
    region: "us-east-2"
});
const S3 = new AWS.S3()
// models 
const UsersModel = db.UsersModel;
const DoctorsModel = db.DoctorsModel;
const MedicineFormModel = db.MedicineFormModel;
const MedicineStrengthModel = db.MedicineStrengthModel;
const ReminderFrequencyModel = db.ReminderFrequencyModel;
const ReminderTimeModel = db.ReminderTimeModel;
const MedicineReminderModel = db.MedicineReminderModel;
const LanguageModel = db.LanguageModel;
const CategoryModel = db.CategoryModel;
const SubcategoryModel = db.CategoryModel;
const FavoriteModel = db.FavoriteModel;

module.exports = {
    constants, utils, ejs, fs, axios, moment, db, sgMail,UsersModel,DoctorsModel, MedicineFormModel,
    MedicineStrengthModel, ReminderFrequencyModel, ReminderTimeModel, MedicineReminderModel,LanguageModel, CategoryModel, SubcategoryModel, FavoriteModel, S3
}
