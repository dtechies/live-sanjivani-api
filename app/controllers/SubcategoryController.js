const {
  SubcategoryModel,
  UserSubcategoriesValueModel,
  jwt,
  moment,
  Op,
} = require("../imports");
const constants = require("../imports").constants;

exports.allSubCategory = async (req, res, next) => {
  const user_id = req.user_id;

  let subCategoryData = await UserSubcategoriesValueModel.findAll({
    raw: true,
    where: { user_id: user_id },
    order: [["created_at", "DESC"]],
    attributes: ["subcategory_id", "value"],
    include: [
      {
        model: SubcategoryModel,
      },
    ],
  });
  let subcategoryValueData = [];
  let dataN = [];
  if (subCategoryData) {
    subCategoryData.forEach((data) => {
      if (subcategoryValueData.includes(data.subcategory_id)) {
      } else {
        subcategoryValueData.push(data.subcategory_id);
        dataN.push({
          subcategory_id: data.subcategory_id,
          value: data.value,
          name: data["subcategory.name"],
          icon: data["subcategory.icon"],
          unit: data["subcategory.unit"],
          type: data["subcategory.type"],
          category_id: data["subcategory.category_id"],
        });
      }
    });
    let result = dataN.sort(compare);
    return res.json(
      constants.responseObj(
        true,
        200,
        constants.messages.Success,
        false,
        result
      )
    );
  } else {
    return res.json(
      constants.responseObj(false, 202, constants.messages.NoSubCategory)
    );
  }
};

exports.addSubCategoryValue = async (req, res, next) => {
  try {
    const user_id = req.user_id;
    let subcategory_value_data = req.body.subcategory_data;
    let subcategoryValue = [];
    if (subcategory_value_data) {
      let current_time = moment().format("HH:mm");
      let current_month = moment().format("M");
      subcategory_value_data.forEach((data) => {
        subcategoryValue.push({
          user_id: user_id,
          subcategory_id: data.subcategory_id,
          value: data.value,
          is_selected: 0,
          value_added_time: current_time,
          value_added_month: current_month,
        });
      });
      const addSubcategoryValue = await UserSubcategoriesValueModel.bulkCreate(
        subcategoryValue
      ).catch((err) => {
        constants.responseObj(
          false,
          500,
          constants.messages.SomethingWentWrong
        );
      });
      if (addSubcategoryValue) {
        return res.json(
          constants.responseObj(true, 201, constants.messages.AddSuccess, false)
        );
      } else {
        return res.json(
          constants.responseObj(
            false,
            500,
            constants.messages.SomethingWentWrong
          )
        );
      }
    } else {
      constants.responseObj(false, 500, constants.messages.SomethingWentWrong);
    }
  } catch (err) {
    return constants.responseObj(
      false,
      500,
      constants.messages.SomethingWentWrong
    );
  }
};
function compare(a, b) {
  if (Number(a.subcategory_id) < Number(b.subcategory_id)) {
    return -1;
  }
  if (Number(a.subcategory_id) > Number(b.subcategory_id)) {
    return 1;
  }
  return 0;
}

exports.getSubCategoryGraph = async (req, res, next) => {
  const user_id = req.user_id;
  const subcategory_id = req.body.subcategory_id;
  let daily_data = [];
  let today = moment().format("YYYY-MM-DD");
  let startDate = today + " 00:00:00";
  let endDate = today + " 23:59:59";
  for (let time = 0; time < 24; time += 2) {
    let subCategoryData = await UserSubcategoriesValueModel.findAll({
      raw: true,
      where: {
        user_id: user_id,
        subcategory_id: subcategory_id,
        value_added_time: {
          [Op.between]: [
            `${time.toString().length > 1 ? time : "0" + time}:00`,
            `${
              (time + 2).toString().length > 1 ? time + 2 : "0" + (time + 2)
            }:00`,
          ],
        },
        created_at: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [["created_at", "DESC"]],
      attributes: ["subcategory_id", "value"],
    });
    if (subCategoryData.length) {
      let sum = 0;
      for (let value = 0; value < subCategoryData.length; value++) {
        sum = sum + Number(subCategoryData[value].value);
      }
      daily_data.push({
        time:
          `${time.toString().length > 1 ? time : "0" + time}:00` +
          "-" +
          `${
            (time + 2).toString().length > 1 ? time + 2 : "0" + (time + 2)
          }:00`,
        data: parseInt(Number(sum) / Number(subCategoryData.length)),
      });
    } else {
      daily_data.push({
        time:
          `${time.toString().length > 1 ? time : "0" + time}:00` +
          "-" +
          `${
            (time + 2).toString().length > 1 ? time + 2 : "0" + (time + 2)
          }:00`,
        data: null,
      });
    }
  }
  let weekly_data = [];
  let week_dates = getCurrentWeek();
  for (let week = 0; week < week_dates.length; week++) {
    let startDate = week_dates[week] + " 00:00:00";
    let endDate = week_dates[week] + " 23:59:59";
    let subCategoryData = await UserSubcategoriesValueModel.findAll({
      raw: true,
      where: {
        user_id: user_id,
        subcategory_id: subcategory_id,
        created_at: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [["created_at", "DESC"]],
      attributes: ["subcategory_id", "value"],
    });
    if (subCategoryData.length) {
      let sum = 0;
      for (let value = 0; value < subCategoryData.length; value++) {
        sum = sum + Number(subCategoryData[value].value);
      }
      weekly_data.push({
        date: week_dates[week],
        data: parseInt(Number(sum) / Number(subCategoryData.length)),
      });
    } else {
      weekly_data.push({ date: week_dates[week], data: null });
    }
  }

  let monthly_data = [];
  let month_dates = getCurrentMonthDateRange();
  for (let month = 0; month < month_dates.length; month++) {
    let startDate = month_dates[month].startDate + " 00:00:00";
    let endDate =
      moment(month_dates[month].endDate)
        .subtract(1, "days")
        .format("YYYY-MM-DD") + " 23:59:59";
    let subCategoryData = await UserSubcategoriesValueModel.findAll({
      raw: true,
      where: {
        user_id: user_id,
        subcategory_id: subcategory_id,
        created_at: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [["created_at", "DESC"]],
      attributes: ["subcategory_id", "value"],
    });
    if (subCategoryData.length) {
      let sum = 0;
      for (let value = 0; value < subCategoryData.length; value++) {
        sum = sum + Number(subCategoryData[value].value);
      }
      monthly_data.push({
        date: month_dates[month].startDate + "-" + month_dates[month].endDate,
        data: parseInt(Number(sum) / Number(subCategoryData.length)),
      });
    } else {
      monthly_data.push({
        date: month_dates[month].startDate + "-" + month_dates[month].endDate,
        data: null,
      });
    }
  }

  let yearly_data = [];
  for (let year = 1; year <= 12; year++) {
    let subCategoryData = await UserSubcategoriesValueModel.findAll({
      raw: true,
      where: {
        user_id: user_id,
        subcategory_id: subcategory_id,
        value_added_month: year,
      },
      order: [["created_at", "DESC"]],
      attributes: ["subcategory_id", "value"],
    });
    let sum = 0;
    for (let value = 0; value < subCategoryData.length; value++) {
      sum = sum + Number(subCategoryData[value].value);
    }
    if (subCategoryData) {
      yearly_data.push({
        month: year,
        data: parseInt(Number(sum) / Number(subCategoryData.length)),
      });
    } else {
      yearly_data.push({ month: year, data: null });
    }
  }

  return res.json(
    constants.responseObj(true, 201, constants.messages.DataFound, false, {
      DailyData: daily_data,
      WeeklyData: weekly_data,
      MonthlyData: monthly_data,
      YearlyData: yearly_data,
    })
  );
};

function getCurrentWeek() {
  var currentDate = moment();

  var weekStart = currentDate.clone().startOf("isoWeek");
  var days = [];

  for (var i = 0; i <= 6; i++) {
    days.push(moment(weekStart).add(i, "days").format("YYYY-MM-DD"));
  }
  return days;
}
function getCurrentMonthDateRange() {
  let startOfMonth = moment().startOf("month");
  let endOfMonth = moment().endOf("month");
  let dates = [];
  while (startOfMonth < endOfMonth) {
    startOfMonth.add({ days: 3 });
    if (startOfMonth < endOfMonth) {
      dates.push(startOfMonth.format("YYYY-MM-DD"));
    }
  }
  let newDates = [];
  dates.map((i, k) => {
    if (k == 0) {
      newDates.push({
        startDate: startOfMonth.format("YYYY-MM-DD"),
        endDate: dates[k],
      });
    } else if (k + 1 == dates.length) {
      newDates.push({
        startDate: dates[k],
        endDate: endOfMonth.format("YYYY-MM-DD"),
      });
    } else {
      newDates.push({ startDate: dates[k], endDate: dates[k + 1] });
    }
  });
  return newDates;
}
