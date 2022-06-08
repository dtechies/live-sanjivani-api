module.exports = (sequelize, Sequelize) => {
  const MedicineDataModel = sequelize.define(
    "medicine_data",
    {
      name: { type: Sequelize.STRING(50), notNull: true },
      use: { type: Sequelize.STRING(100), notNull: true },
      benefits: { type: Sequelize.STRING(200), notNull: true },
      side_effects: { type: Sequelize.STRING(200), notNull: true },
      safety_advice: { type: Sequelize.STRING(200), notNull: true },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "medicine_data",
    }
  );
  return MedicineDataModel;
};
