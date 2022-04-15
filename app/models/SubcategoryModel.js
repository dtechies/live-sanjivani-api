module.exports = (sequelize, Sequelize) => {
    const SubcategoryModel = sequelize.define(
        'subcategory',
        {
            category_id: { type: Sequelize.INTEGER, notNull: true ,references: {
                // This is a reference to another model
                model: "category",

                // This is the column name of the referenced model
                key: 'id'
            }},
            name: { type: Sequelize.STRING, notNull: true },
            icon: { type: Sequelize.STRING, notNull: true },
            unit: { type: Sequelize.STRING, notNull: true },
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'subcategory',
        },
        
    );
    return SubcategoryModel;
};
