module.exports = (sequelize, Sequelize) => {
  const SubcategoryModel = sequelize.define(
    "subcategory",
    {
      name: {
        type: Sequelize.STRING,
        notNull: true,
      },
      icon: {
        type: Sequelize.STRING,
        notNull: true,
      },
      unit: {
        type: Sequelize.STRING,
        notNull: true,
      },
      type: {
        type: Sequelize.STRING,
        notNull: false,
      },
      is_graph: {
        type: Sequelize.BOOLEAN,
        notNull: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "subcategory",
    }
  );

  SubcategoryModel.associate = (models) => {
    SubcategoryModel.belongsTo(models.CategoryModel, {
      foreignKey: "category_id",
    });

    SubcategoryModel.hasMany(models.UserSubcategoriesValueModel, {
      foreignKey: "subcategory_id",
    });

    SubcategoryModel.hasMany(models.NestedSubcategoryModel, {
      foreignKey: "subcategory_id",
    });
    SubcategoryModel.hasMany(models.OtherSubcategoryModel, {
      foreignKey: "subcategory_id",
    });
  };

  return SubcategoryModel;
};
