const path = require("path");
const { I18n } = require("i18n");

const en = require("../i18n/locales/en.json");
const hi = require("../i18n/locales/hi.json");

function languageFunc(language) {
  return new I18n({
    locales: [hi, en],
    directory: path.join(__dirname, "/locales"),
    defaultLocale: language,
  });
}

// console.log("i18n----", i18n.__(`Success`));
module.exports = {
  languageFunc,
};
