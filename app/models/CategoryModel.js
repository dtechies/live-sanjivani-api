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
        }
    );
    return CategoryModel;
};
