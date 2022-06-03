module.exports = (sequelize, Sequelize) => {
  const CareGiverModel = sequelize.define(
    "care_giver",
    {
      first_name: { type: Sequelize.STRING(50), notNull: false },
      last_name: { type: Sequelize.STRING(50), notNull: false },
      contact_no: { type: Sequelize.STRING(13), notNull: true },
      email: { type: Sequelize.STRING(50), notNull: true },
      nick_name: { type: Sequelize.STRING(50), notNull: true },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "care_giver",
    }
  );
  CareGiverModel.associate = (models) => {
    CareGiverModel.belongsTo(models.UsersModel, {
      foreignKey: "user_id",
    });
  };
  return CareGiverModel;
};
