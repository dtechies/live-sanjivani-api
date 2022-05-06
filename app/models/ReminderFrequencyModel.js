module.exports = (sequelize, Sequelize) => {
    const ReminderFrequencyModel = sequelize.define(
        'reminder_frequency',
        {
            name: { type: Sequelize.STRING(50), notNull: true },
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'reminder_frequency',
        }
    );
    return ReminderFrequencyModel;
};
