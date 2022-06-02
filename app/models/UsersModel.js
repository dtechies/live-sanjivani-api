module.exports = (sequelize, Sequelize) => {
  const UsersModel = sequelize.define(
    "user",
    {
      first_name: { type: Sequelize.STRING(50), notNull: true },
      last_name: { type: Sequelize.STRING(50), notNull: true },
      gender: { type: Sequelize.STRING(10), notNull: true },
      dob: { type: Sequelize.DATEONLY, notNull: true },
      email: { type: Sequelize.STRING(50), notNull: true },
      mob_no: { type: Sequelize.STRING(13), notNull: true },
      language: { type: Sequelize.STRING(50), notNull: true },
      image: { type: Sequelize.STRING(200), notNull: false },
      otp: { type: Sequelize.STRING },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "user",
    }
  );
  UsersModel.associate = (models) => {
    UsersModel.hasMany(models.AppointmentReminderModel, {
      foreignKey: "user_id",
      // sourceKey:'user_id'
    });
    UsersModel.hasMany(models.UserSubcategoriesValueModel, {
      foreignKey: "user_id",
      // sourceKey:'user_id'
    });
    UsersModel.hasMany(models.MedicalJournalNoteModel, {
      foreignKey: "user_id",
      //  sourceKey:'user_id'
    });
  };
  return UsersModel;
};
