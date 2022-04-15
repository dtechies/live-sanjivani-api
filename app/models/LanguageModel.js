module.exports = (sequelize, Sequelize) => {
    const LanguageModel = sequelize.define(
        'language',
        {
            tag: { type: Sequelize.STRING, notNull: true },
            name	: { type: Sequelize.STRING, notNull: true },
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'language',
        }
    );
    return LanguageModel;
};
