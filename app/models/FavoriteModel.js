module.exports = (sequelize, Sequelize) => {
    const FavoriteModel = sequelize.define(
        'user_favorites',
        {
            value: { type: Sequelize.STRING, notNull: true },
            is_selected: { type: Sequelize.BOOLEAN, notNull: true },
           },
        {
            timestamps: true,
            underscored: true,
            tableName: 'user_favorites',
        }
    );
      FavoriteModel.associate =(models) => {
        FavoriteModel.belongsTo(models.SubCategoryModel, {
          foreignKey: 'subcategory_id'
        });
          FavoriteModel.belongsTo(models.UsersModel, {
          foreignKey: 'user_id',
          // targetKey: 'user_id'
        })
      }
    return FavoriteModel;
};
