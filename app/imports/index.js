const constants = require('../constants')
const axios = require('axios')
var moment = require('moment');
const db = require("../models");
const sgMail = require("@sendgrid/mail");
const ejs = require("ejs");
const fs = require("fs");
const jwt = require('jsonwebtoken');




require("dotenv").config();
const AWS = require('aws-sdk')
AWS.config.region = 'us-east-1';
AWS.config.update({
    accessKeyId: 'AKIAWEN5XFEYNIR6VQEM',
    secretAccessKey:'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',
    region:'us-east-1'
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
const SubcategoryModel = db.SubCategoryModel;
const FavoriteModel = db.FavoriteModel;
const TipForDayModel = db.TipForDayModel;
const AppointmentReminderModel=db.AppointmentReminderModel;
const MedicalJournalNoteModel=db.MedicalJournalNoteModel;
const HelpSupportModel=db.HelpSupportModel;
const otpModel=db.otpModel;

module.exports = {
    constants, jwt, ejs, fs, axios, moment, db, sgMail,UsersModel,DoctorsModel, MedicineFormModel,
    MedicineStrengthModel, ReminderFrequencyModel, ReminderTimeModel, MedicineReminderModel,LanguageModel,
    CategoryModel, SubcategoryModel, FavoriteModel, S3, TipForDayModel,AppointmentReminderModel,
    MedicalJournalNoteModel,HelpSupportModel,AWS,otpModel
}
 