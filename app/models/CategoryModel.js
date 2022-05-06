module.exports = (sequelize, Sequelize) => {
    const CategoryModel = sequelize.define(
        'category',
        {
            name: { type: Sequelize.STRING, notNull: true },
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'category',
        },
   );
      CategoryModel.associate =(models) => {
        CategoryModel.hasMany(models.SubCategoryModel, {
          foreignKey: 'category_id'
        });
      }
    return CategoryModel;
};
