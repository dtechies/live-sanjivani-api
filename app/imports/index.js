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
AWS.config.update({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey:process.env.secretAccessKey,
    region:process.env.region
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
const TipForDayModel = db.TipForDayModel;
const AppointmentReminderModel=db.AppointmentReminderModel;
const MedicalJounalNoteModel=db.MedicalJounalNoteModel;

module.exports = {
    constants, jwt, ejs, fs, axios, moment, db, sgMail,UsersModel,DoctorsModel, MedicineFormModel,
    MedicineStrengthModel, ReminderFrequencyModel, ReminderTimeModel, MedicineReminderModel,LanguageModel, CategoryModel, SubcategoryModel, FavoriteModel, S3, TipForDayModel,AppointmentReminderModel, MedicalJounalNoteModel
}
