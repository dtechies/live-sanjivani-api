module.exports = (sequelize, Sequelize) => {
    const ReminderTimeModel = sequelize.define(
        'reminder_time',
        {
            name: { type: Sequelize.STRING(50), notNull: true },
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'reminder_time',
        }
    );
    return ReminderTimeModel;
};
