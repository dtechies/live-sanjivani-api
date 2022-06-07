module.exports = (sequelize, Sequelize) => {
  const MedicineReminderModel = sequelize.define(
    "medicine_reminder",
    {
      reminder_name: { type: Sequelize.STRING(100), notNull: true },
      medicine_name: { type: Sequelize.STRING(100), notNull: true },
      medicine_image: { type: Sequelize.STRING(200), notNull: true },
      medicine_form: { type: Sequelize.STRING(50), notNull: true },
      dose: { type: Sequelize.INTEGER, notNull: true },
      medicine_strength: { type: Sequelize.STRING(50), notNull: true },
      medicine_strength_unit: { type: Sequelize.STRING(50), notNull: true },
      reminder_frequency: { type: Sequelize.STRING(50), notNull: true },
      frequency_value: { type: Sequelize.STRING(50), notNull: true },
      reminder_time: { type: Sequelize.STRING(50), notNull: true },
      user_selected_time: { type: Sequelize.STRING(50), notNull: true },
      pills_remaining: { type: Sequelize.INTEGER, notNull: true },
      status: { type: Sequelize.BOOLEAN, notNull: true },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "medicine_reminder",
    }
  );
  MedicineReminderModel.associate = (models) => {
    MedicineReminderModel.belongsTo(models.DoctorsModel, {
      foreignKey: "doctor_id",
    });
    MedicineReminderModel.belongsTo(models.UsersModel, {
      foreignKey: "user_id",
      // targetKey: 'user_id'
    });
  };
  return MedicineReminderModel;
};
