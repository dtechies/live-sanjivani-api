module.exports = (sequelize, Sequelize) => {
  const HelpSupportModel = sequelize.define(
    "help_support",
    {
      name: { type: Sequelize.STRING, notNull: false },
      description: { type: Sequelize.STRING(2000), notNull: false },
      type: { type: Sequelize.STRING, notNull: false },
      icon: { type: Sequelize.STRING, notNull: false },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "help_support",
    }
  );
  return HelpSupportModel;
};
