module.exports = (sequelize, Sequelize) => {
  const OTPModel = sequelize.define(
    "user_otp",
    {
      otp: { type: Sequelize.STRING(50), notNull: true },
      mob_no: { type: Sequelize.STRING(20), notNull: true },
      country_code: { type: Sequelize.STRING },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "user_otp",
    }
  );
  OTPModel.associate = (models) => {
    OTPModel.belongsTo(models.UsersModel, {
      foreignKey: "user_id",
    });
  };
  return OTPModel;
};
