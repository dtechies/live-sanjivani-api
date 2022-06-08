module.exports = (sequelize, Sequelize) => {
  const AppointmentReminderModel = sequelize.define(
    "appointment_reminder",
    {
      date: { type: Sequelize.STRING(50), notNull: true },
      // address1: { type: Sequelize.STRING(50), notNull: true },
      // address2: { type: Sequelize.STRING(50), notNull: true },
      // city	: { type: Sequelize.STRING(50), notNull: true },
      // state	: { type: Sequelize.STRING(50), notNull: true },
      // pincode: { type: Sequelize.INTEGER, notNull: true },
      user_selected_time: { type: Sequelize.STRING(50), notNull: true },
      status: { type: Sequelize.BOOLEAN, notNull: true },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "appointment_reminder",
    }
  );
  AppointmentReminderModel.associate = (models) => {
    AppointmentReminderModel.belongsTo(models.DoctorsModel, {
      foreignKey: "doctor_id",
    });
    AppointmentReminderModel.belongsTo(models.UsersModel, {
      foreignKey: "user_id",
      //   targetKey: 'user_id'
    });
  };
  return AppointmentReminderModel;
};
