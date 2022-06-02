module.exports = (sequelize, Sequelize) => {
  const UserSubcategoriesValueModel = sequelize.define(
    "user_subcategories_value",
    {
      value: { type: Sequelize.STRING, notNull: true },
      is_selected: { type: Sequelize.BOOLEAN, notNull: true },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "user_subcategories_value",
    }
  );
  UserSubcategoriesValueModel.associate = (models) => {
    UserSubcategoriesValueModel.belongsTo(models.SubCategoryModel, {
      foreignKey: "subcategory_id",
    });
    UserSubcategoriesValueModel.belongsTo(models.UsersModel, {
      foreignKey: "user_id",
      // targetKey: 'user_id'
    });
  };
  return UserSubcategoriesValueModel;
};
