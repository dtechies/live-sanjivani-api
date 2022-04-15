module.exports = (sequelize, Sequelize) => {
    const FavoriteModel = sequelize.define(
        'user_favorites',
        {
            value: { type: Sequelize.STRING, notNull: true },
            is_selected: { type: Sequelize.BOOLEAN, notNull: true },
            subcategory_id: { type: Sequelize.INTEGER, notNull: true ,references: {
                // This is a reference to another model
                model: "subcategory",

                // This is the column name of the referenced model
                key: 'id'
            }},
            user_id: { type: Sequelize.INTEGER, notNull: true ,references: {
                // This is a reference to another model
                model: "user",

                // This is the column name of the referenced model
                key: 'id'
            }},
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'user_favorites',
        }
    );
    return FavoriteModel;
};
