const SubcategoryModel = require("./SubcategoryModel");

module.exports = (sequelize, Sequelize) => {
  const NestedSubcategoryModel = sequelize.define(
    "nestedSubcategory",
    {
      name: {
        type: Sequelize.STRING,
        notNull: false,
      },
      unit: {
        type: Sequelize.STRING,
        notNull: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "nestedSubcategory",
    }
  );

  NestedSubcategoryModel.associate = (models) => {
    NestedSubcategoryModel.belongsTo(models.SubCategoryModel, {
      foreignKey: "subcategory_id",
    });
  };

  return NestedSubcategoryModel;
};
