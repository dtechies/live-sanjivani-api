module.exports = (sequelize, Sequelize) => {
    const TipForDayModel = sequelize.define(
        'tipforday',
        {
            name: { type: Sequelize.STRING, notNull: true },
            value: { type: Sequelize.STRING, notNull: true },
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'tipforday',
        }
    );
    return TipForDayModel;
};
