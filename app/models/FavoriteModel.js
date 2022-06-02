module.exports = (sequelize, Sequelize) => {
  const UserFavoriteModel = sequelize.define(
    "user_favorites",
    {
      subcategory_id: { type: Sequelize.INTEGER, notNull: true },
      user_id: { type: Sequelize.INTEGER, notNull: true },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "user_favorites",
    }
  );
  UserFavoriteModel.associate = (models) => {
    UserFavoriteModel.belongsTo(models.SubCategoryModel, {
      foreignKey: "subcategory_id",
    });
    UserFavoriteModel.belongsTo(models.UsersModel, {
      foreignKey: "user_id",
      // targetKey: 'user_id'
    });
  };
  return UserFavoriteModel;
};
