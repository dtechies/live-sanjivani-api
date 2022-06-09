const SubcategoryModel = require("./SubcategoryModel");

module.exports = (sequelize, Sequelize) => {
  const NestedSubcategoryModel = sequelize.define(
    "nested_subcategory",
    {
      value: {
        type: Sequelize.STRING,
        notNull: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "nested_subcategory",
    }
  );

  NestedSubcategoryModel.associate = (models) => {
    NestedSubcategoryModel.belongsTo(models.SubCategoryModel, {
      foreignKey: "subcategory_id",
    });
    NestedSubcategoryModel.belongsTo(models.UsersModel, {
      foreignKey: "user_id",
    });
  };

  return NestedSubcategoryModel;
};
