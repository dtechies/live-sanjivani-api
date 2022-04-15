module.exports = (sequelize, Sequelize) => {
    const MedicationReminderModel = sequelize.define(
        'medicine_reminder',
        {
            user_id: { type: Sequelize.INTEGER,references: {model: 'user',key: 'id'} },
            referred_by_doctor: { type: Sequelize.STRING(50), notNull: true },
            medicine_name: { type: Sequelize.STRING(100), notNull: true },
            medicine_image: { type: Sequelize.STRING(50), notNull: true },
            medicine_form: { type: Sequelize.STRING(50), notNull: true },
            dose: { type: Sequelize.INTEGER, notNull: true , unique: true},
            medicine_strength	: { type: Sequelize.STRING(50), notNull: true },
            medicine_strength_unit	: { type: Sequelize.STRING(50), notNull: true },
            reminder_frequency	: { type: Sequelize.STRING(50), notNull: true },
            frequency_value	: { type: Sequelize.STRING(50), notNull: true },
            reminder_time	: { type: Sequelize.STRING(50), notNull: true },
            user_selected_time	: { type: Sequelize.TIME, notNull: true },
            pills_remaining	: { type: Sequelize.INTEGER, notNull: true },
            status	: { type: Sequelize.BOOLEAN, notNull: true },
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'medicine_reminder',
        }
    );
    return MedicationReminderModel;
};
