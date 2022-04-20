module.exports = (sequelize, Sequelize) => {
    const SubcategoryModel = sequelize.define(
        'subcategory',
        {
            name: { type: Sequelize.STRING, notNull: true },
            icon: { type: Sequelize.STRING, notNull: true },
            unit: { type: Sequelize.STRING, notNull: true },
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'subcategory',
        });
          SubcategoryModel.associate =(models) => {
        SubcategoryModel.belongsTo(models.CategoryModel, {
          foreignKey: 'category_id'
        });
       
        SubcategoryModel.hasMany(models.FavoriteModel, {
          foreignKey: 'category_id'
        })
        
      }
    
    return SubcategoryModel;
};

    