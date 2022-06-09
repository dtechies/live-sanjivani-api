const SubcategoryModel = require("./SubcategoryModel");

module.exports = (sequelize, Sequelize) => {
  const OtherSubcategoryModel = sequelize.define(
    "other_subcategory",
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
      tableName: "other_subcategory",
    }
  );

  OtherSubcategoryModel.associate = (models) => {
    OtherSubcategoryModel.belongsTo(models.SubCategoryModel, {
      foreignKey: "subcategory_id",
    });
  };

  return OtherSubcategoryModel;
};
