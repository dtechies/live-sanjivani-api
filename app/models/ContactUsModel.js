module.exports = (sequelize, Sequelize) => {
  const ContactUsModel = sequelize.define(
    "contact_us",
    {
      title: { type: Sequelize.STRING(50), notNull: true },
      date: { type: Sequelize.STRING(50), notNull: false },
      image: { type: Sequelize.STRING(50), notNull: false },
      note: { type: Sequelize.STRING(250), notNull: false },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "contact_us",
    }
  );
  ContactUsModel.associate = (models) => {
    ContactUsModel.belongsTo(models.UsersModel, {
      foreignKey: "user_id",
    });
  };
  return ContactUsModel;
};
