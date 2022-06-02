const constants = require("../constants");
const axios = require("axios");
var moment = require("moment");
const db = require("../models");
const sgMail = require("@sendgrid/mail");
const ejs = require("ejs");
const fs = require("fs");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.REGION,
});
const S3 = new AWS.S3();
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
const UserSubcategoriesValueModel = db.UserSubcategoriesValueModel;
const TipForDayModel = db.TipForDayModel;
const AppointmentReminderModel = db.AppointmentReminderModel;
const MedicalJournalNoteModel = db.MedicalJournalNoteModel;
const HelpSupportModel = db.HelpSupportModel;
const otpModel = db.otpModel;
const NestedSubcategoryModel = db.NestedSubcategoryModel;

module.exports = {
  constants,
  jwt,
  ejs,
  fs,
  axios,
  moment,
  db,
  sgMail,
  UsersModel,
  DoctorsModel,
  MedicineFormModel,
  MedicineStrengthModel,
  ReminderFrequencyModel,
  ReminderTimeModel,
  MedicineReminderModel,
  LanguageModel,
  CategoryModel,
  SubcategoryModel,
  UserSubcategoriesValueModel,
  S3,
  TipForDayModel,
  AppointmentReminderModel,
  MedicalJournalNoteModel,
  HelpSupportModel,
  AWS,
  otpModel,
  NestedSubcategoryModel,
};
