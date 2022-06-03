module.exports = (sequelize, Sequelize) => {
  const TipForDayModel = sequelize.define(
    "tip_for_day",
    {
      name: { type: Sequelize.STRING, notNull: true },
      value: { type: Sequelize.STRING, notNull: true },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "tip_for_day",
    }
  );
  TipForDayModel.associate = (models) => {
    TipForDayModel.belongsTo(models.UsersModel, {
      foreignKey: "user_id",
    });
  };
  return TipForDayModel;
};
