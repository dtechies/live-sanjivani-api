const db = require("../models");

exports.addCategory = async () => {
  let categoryData = [
    { name: "Vitals" },
    { name: "Measurements" },
    { name: "Activity" },
    { name: "Others" },
    { name: "Care Giver" },
    { name: "Medications" },
    { name: "Appointments" },
    { name: "Symptoms Check" },
  ];
  let subcategoryData = [
    {
      name: "Heart Rate",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/heart-rate.svg",
      unit: "BPM",
      category_id: 1,
      type: "integer",
      is_graph: 1,
    },
    {
      name: "Respiratory Rate",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/repiratory.svg",
      unit: "breaths/min",
      category_id: 1,
      type: "fractional",
      is_graph: 1,
    },
    {
      name: "Body Temperature",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/body-temperature.svg",
      unit: "*F",
      category_id: 1,
      type: "fractional",
      is_graph: 1,
    },
    {
      name: "Oxygen Saturation",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/oxygen-saturation.svg",
      unit: "%",
      category_id: 1,
      type: "fractional",
      is_graph: 1,
    },
    {
      name: "Blood Pressure",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/blood-pressure.svg",
      unit: "mmHg",
      category_id: 1,
      type: "integer",
      is_graph: 0,
    },
    {
      name: "Blood Glucose",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/blood-glucose.svg",
      unit: "mg/dL",
      category_id: 1,
      type: "string",
      is_graph: 0,
    },
    {
      name: "Height",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/height.svg",
      unit: "feet",
      category_id: 2,
      type: "integer",
      is_graph: 1,
    },
    {
      name: "Weight",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/weight.svg",
      unit: "kg",
      category_id: 2,
      type: "fractional",
      is_graph: 1,
    },
    {
      name: "Sleep",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/sleep.svg",
      unit: "Hours and minutes",
      category_id: 3,
      type: "free_text",
      is_graph: 1,
    },
    {
      name: "Allergies",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/allergy.svg",
      unit: "Free Text",
      category_id: 4,
      type: "free_text",
      is_graph: 1,
    },
    {
      name: "Menstruation",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/menstruation.svg",
      unit: "No Flow/Flow",
      category_id: 4,
      type: "free_text",
      is_graph: 1,
    },
    {
      name: "Alcohol Consumption",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/alcohol-consumption.svg",
      unit: "drinks",
      category_id: 4,
      type: "integer",
      is_graph: 1,
    },
    {
      name: "Inhaler Usage",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/inhaler.svg",
      unit: "Time",
      category_id: 4,
      type: "integer",
      is_graph: 1,
    },
    {
      name: "Sexual Activity",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/sexual-activity.svg",
      category_id: 4,
      type: "free_text",
      is_graph: 1,
    },
    {
      name: "Toothbrushing",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/toothbrushing.svg",
      unit: "Minutes",
      category_id: 4,
      type: "integer",
      is_graph: 1,
    },
    {
      name: "BMI",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/bmi.svg",
      unit: "",
      category_id: 2,
      type: "fractional",
      is_graph: 1,
    },
    {
      name: "Steps",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/steps.svg",
      unit: "Steps",
      category_id: 3,
      type: "fractional",
      is_graph: 1,
    },
    {
      name: "Calories",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/calories.svg",
      unit: "kcal",
      category_id: 2,
      type: "fractional",
      is_graph: 1,
    },
  ];
  db.CategoryModel.bulkCreate(categoryData).then(() => {
    db.SubCategoryModel.bulkCreate(subcategoryData).then(() => {
      let otherSubcategoryData = [
        {
          name: "Element",
          unit: "Text",
          subcategory_id: 10,
        },
        {
          name: "Reaction",
          unit: "Text",
          subcategory_id: 10,
        },
        {
          name: "Severity",
          unit: "Text",
          subcategory_id: 10,
        },
        { name: "Onset", unit: "Text", type: "date", subcategory_id: 10 },
        {
          name: "Flow",
          unit: "['Flow','No Flow']",
          subcategory_id: 11,
        },
        {
          name: "Start of Cycle",
          unit: "['Yes','No']",
          subcategory_id: 11,
        },
        {
          name: "Drink",
          unit: "Number",
          subcategory_id: 12,
        },
        {
          name: "Inhaler",
          unit: "Puffs",
          subcategory_id: 13,
        },
        {
          name: "Protection",
          unit: "['Protection Used','No Protection Used']",
          subcategory_id: 14,
        },
        {
          name: "Toothbrushing",
          unit: "Time a Day",
          subcategory_id: 15,
        },
      ];
      db.OtherSubcategoryModel.bulkCreate(otherSubcategoryData);
    });
  });
};

exports.addHelpSupport = () => {
  let helpSupportData = [
    {
      name: "Help Center",
      description:
        "<h1> Help Center</h1>\n<p> Need to contact us or want to give us feedback use <b>Contact Us</b></p>",
      type: "Support",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/help.svg",
    },
    {
      name: "Contact US",
      description:
        '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><p>This is a static HTML Contact page!</p></body></html>',
      type: "Support",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/md-contacts.svg",
    },
    {
      name: "Terms of Use",
      description:
        '<h1>Terms of Use</h1><div><p>Please refer to our website at <a href="https://livesanjivani.com/terms-of-use/">Live Sanjivani Terms of Use</a></p></div>',
      type: "Disclosures",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/file.svg",
    },
    {
      name: "Privacy",
      description:
        "<html><head><meta name='viewport' content='width=device-width, initial-scale=1.0'></head><body><p>This is a static HTML Privacy page!</p></body></html>",
      type: "Disclosures",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/shield-fill-exclamation.svg",
    },
  ];
  db.HelpSupportModel.bulkCreate(helpSupportData);
};

// exports.addMedicineFormData = () => {
//   let medicineFormData = [
//     { name: "Tablet" },
//     { name: "Drop" },
//     { name: "Pill" },
//     { name: "Inhaler" },
//   ];
//   db.medicineFormData.bulkCreate(medicineFormData);
// };
exports.addMedicineStrength = () => {
  let medicineStrengthData = [
    { unit: "Mg" },
    { unit: "Mcg" },
    { unit: "G" },
    { unit: "IU" },
    { unit: "ml" },
  ];
  db.MedicineStrengthModel.bulkCreate(medicineStrengthData);
};

exports.addReminderFrequencyData = () => {
  let reminderFrequencyData = [
    { name: "Fixed Date" },
    { name: "EveryDay" },
    { name: "Alternate Day" },
    { name: "Once A Week" },
  ];
  db.ReminderFrequencyModel.bulkCreate(reminderFrequencyData);
};

exports.addReminderTimeData = () => {
  let reminderTimeData = [
    { name: "Before Breakfast" },
    { name: "After Breakfast" },
    { name: "Before Lunch" },
    { name: "After Lunch" },
    { name: "Before Dinner" },
    { name: "After Dinner" },
    { name: "One Fixed Time" },
  ];
  db.ReminderTimeModel.bulkCreate(reminderTimeData);
};

exports.addSubcategoryData = async () => {
  let subcategoryData = [
    {
      name: "Heart Rate",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/heart-rate.svg",
      unit: "BPM",
      category_id: 1,
      type: "integer",
      is_graph: 1,
    },
    {
      name: "Respiratory Rate",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/repiratory.svg",
      unit: "breaths/min",
      category_id: 1,
      type: "fractional",
      is_graph: 1,
    },
    {
      name: "Body Temperature",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/body-temperature.svg",
      unit: "*F",
      category_id: 1,
      type: "fractional",
      is_graph: 1,
    },
    {
      name: "Oxygen Saturation",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/oxygen-saturation.svg",
      unit: "%",
      category_id: 1,
      type: "fractional",
      is_graph: 1,
    },
    {
      name: "Blood Pressure",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/blood-pressure.svg",
      unit: "mmHg",
      category_id: 1,
      type: "integer",
      is_graph: 0,
    },
    {
      name: "Blood Glucose",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/blood-glucose.svg",
      unit: "mg/dL",
      category_id: 1,
      type: "string",
      is_graph: 0,
    },
    {
      name: "Height",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/height.svg",
      unit: "feet",
      category_id: 2,
      type: "integer",
      is_graph: 1,
    },
    {
      name: "Weight",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/weight.svg",
      unit: "kg",
      category_id: 2,
      type: "fractional",
      is_graph: 1,
    },
    {
      name: "Sleep",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/sleep.svg",
      unit: "Hours and minutes",
      category_id: 3,
      type: "free_text",
      is_graph: 1,
    },
    {
      name: "Allergies",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/allergy.svg",
      unit: "Free Text",
      category_id: 4,
      type: "free_text",
      is_graph: 1,
    },
    {
      name: "Menstruation",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/menstruation.svg",
      unit: "No Flow/Flow",
      category_id: 4,
      type: "free_text",
      is_graph: 1,
    },
    {
      name: "Alcohol Consumption",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/alcohol-consumption.svg",
      unit: "drinks",
      category_id: 4,
      type: "integer",
      is_graph: 1,
    },
    {
      name: "Inhaler Usage",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/inhaler.svg",
      unit: "Time",
      category_id: 4,
      type: "integer",
      is_graph: 1,
    },
    {
      name: "Sexual Activity",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/sexual-activity.svg",
      category_id: 4,
      type: "free_text",
      is_graph: 1,
    },
    {
      name: "Toothbrushing",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/toothbrushing.svg",
      unit: "Minutes",
      category_id: 4,
      type: "integer",
      is_graph: 1,
    },
    {
      name: "BMI",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/bmi.svg",
      unit: "",
      category_id: 2,
      type: "fractional",
      is_graph: 1,
    },
    {
      name: "Steps",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/steps.svg",
      unit: "Steps",
      category_id: 3,
      type: "fractional",
      is_graph: 1,
    },
    {
      name: "Calories",
      icon: "https://live-sanjivani.s3.us-east-2.amazonaws.com/SubCategoryIcons/All+Icons+New/calories.svg",
      unit: "kcal",
      category_id: 2,
      type: "fractional",
      is_graph: 1,
    },
  ];
  db.SubCategoryModel.bulkCreate(subcategoryData);
};

exports.addOtherSubcategoryData = async () => {
  let otherSubcategoryData = [
    {
      name: "Element",
      unit: "Text",
      subcategory_id: 10,
    },
    {
      name: "Reaction",
      unit: "Text",
      subcategory_id: 10,
    },
    {
      name: "Severity",
      unit: "Text",
      subcategory_id: 10,
    },
    { name: "Onset", unit: "Text", type: "date", subcategory_id: 10 },
    {
      name: "Flow",
      unit: "['Flow','No Flow']",
      subcategory_id: 11,
    },
    {
      name: "Start of Cycle",
      unit: "['Yes','No']",
      subcategory_id: 11,
    },
    {
      name: "Drink",
      unit: "Number",
      subcategory_id: 12,
    },
    {
      name: "Inhaler",
      unit: "Puffs",
      subcategory_id: 13,
    },
    {
      name: "Protection",
      unit: "['Protection Used','No Protection Used']",
      subcategory_id: 14,
    },
    {
      name: "Toothbrushing",
      unit: "Time a Day",
      subcategory_id: 15,
    },
  ];
  db.OtherSubcategoryModel.bulkCreate(otherSubcategoryData);
};

exports.addSymptomData = () => {
  let symptomData = [
    {
      name: "Headache",
      age: "18-60",
      gender: "female",
      description:
        "Headache pain results from signals interacting among the brain, blood vessels and surrounding nerves. During a headache, an unknown mechanism activates specific nerves that affect muscles and blood vessels. These nerves send pain signals to the brain.",
      how_common:
        "Headache pain results from signals interacting among the brain, blood vessels and surrounding nerves. During a headache, an unknown mechanism activates specific nerves that affect muscles and blood vessels. These nerves send pain signals to the brain.",
      overview:
        "Headaches are a very common condition that most people will experience many times during their lives. The main symptom of a headache is a pain in your head or face. This can be throbbing, constant, sharp or dull.",
      risk_factor:
        "Migraines aren’t fully understood. But researchers think migraines result when unstable nerve cells overreact to various factors (triggers). The nerve cells send out impulses to blood vessels and cause chemical changes in the brain.",
      diagnosed_by:
        "Lifestyle plays an important part in preventing headaches. If you don't smoke, don't drink excessively, get regular sleep, eat a healthy diet and get daily exercise, you are unlikely to suffer from headaches frequently, unless you have a medical problem.",
      did_you_know:
        "Fasting may cause headaches, as a fasting person is likely to have very low blood sugar. But other factors, such as stress, pollution, noise, smoke, flashing lights and certain types of food may also cause headaches.",
      facts: "text",
      treatment:
        "Daily prescription medications, including tricyclic antidepressants, might manage chronic tension-type headaches. Alternative therapies aimed at stress reduction might help.",
      made_worse_by: "text",
      when_to_see_doctor:
        "Migraines are often undiagnosed and untreated. If you regularly have signs and symptoms of migraine, keep a record of your attacks and how you treated them. Then make an appointment with your doctor to discuss your headaches.",
      question_to_ask: "text",
      what_to_expect: "text",
      take_care_of_yourself: "text",
    },
    {
      name: "Diziness",
      age: "40-70",
      gender: "male",
      description:
        "Dizziness can be associated with more serious conditions, such as a stroke or cardiovascular problems. Even on its own, though, if dizziness leads to a fall, it can be dangerous.",
      how_common:
        "It’s common to experience dizziness. Almost half of people see their healthcare provider at some point because of feeling dizzy. The older you are, the more likely you are to have this symptom.",
      overview:
        "A number of conditions can cause dizziness because balance involves several parts of the body.",
      risk_factor: "text",
      diagnosed_by: "text",
      did_you_know: "text",
      facts: "text",
      treatment: "text",
      made_worse_by: "text",
      when_to_see_doctor: "text",
      question_to_ask: "text",
      what_to_expect: "text",
      take_care_of_yourself: "text",
    },
    {
      name: "Facial Pain",
      age: "15-30",
      gender: "other",
      description:
        "A dull, throbbing pain on one side of your face or around your mouth is generally due to problems within the mouth, such as a toothache, cavity, or abscess.",
      how_common: "text",
      overview:
        "Facial pain is pain felt in any part of the face, including the mouth and eyes. Although it’s normally due to an injury or a headache, facial pain may also be the result of a serious medical condition.",
      risk_factor: "text",
      diagnosed_by: "text",
      did_you_know: "text",
      facts: "text",
      treatment: "text",
      made_worse_by: "text",
      when_to_see_doctor:
        "If you experience facial pain, particularly prolonged or recurring pain, or pain unrelieved by over-the-counter pain relievers, see your doctor.",
      question_to_ask: "text",
      what_to_expect: "text",
      take_care_of_yourself: "text",
    },
    {
      name: "Fever",
      age: "15-55",
      gender: "male",
      description:
        "Body temperatures vary slightly from person to person and at different times of day. The average temperature has traditionally been defined as 98.6 F (37 C).",
      how_common: "text",
      overview:
        "A fever is a temporary rise in body temperature. It's one part of an overall response from the body's immune system. A fever is usually caused by an infection.",
      risk_factor: "text",
      diagnosed_by: "text",
      did_you_know: "text",
      facts: "text",
      treatment:
        "especially before eating, after using the toilet, after spending time in a crowd or around someone who's sick, after petting animals, and during travel on public transportation.",
      made_worse_by: "text",
      when_to_see_doctor:
        "if you're an adult with a 103°F (39.4°C) or higher fever",
      question_to_ask: "text",
      what_to_expect: "text",
      take_care_of_yourself: "text",
    },
    {
      name: "Swelling",
      age: "40-80",
      gender: "female",
      description:
        "Swelling occurs when a part of the body increases in size, typically as a result of injury, inflammation, or fluid retention. The medical term for swelling is edema.",
      how_common: "text",
      overview:
        "Swelling can occur in the skin, joints, and other tissues and organs of the body. There are several reasons a person may experience swelling in different parts of their body, with some being more serious than others.",
      risk_factor: "text",
      diagnosed_by: "text",
      did_you_know: "text",
      facts: "text",
      treatment:
        "A person can also try lying on a bed with their feet elevated and wearing compression stockings.",
      made_worse_by: "text",
      when_to_see_doctor:
        "if the swelling is unexplained, does not get better with treatment, or lasts for a long time, a person should talk to a doctor. They can examine the swelling and help determine what is causing it.",
      question_to_ask: "text",
      what_to_expect: "text",
      take_care_of_yourself: "text",
    },
  ];
  db.SymptomModel.bulkCreate(symptomData);
};

exports.addTipForDayData = () => {
  let tipForTheDayData = [
    {
      name: "Tip For Day",
      value: "Start your day with a glass of water",
    },
  ];
  db.TipForDayModel.bulkCreate(tipForTheDayData);
};
