module.exports = (sequelize, Sequelize) => {
    const AppointmentReminderModel = sequelize.define(
        'appointment_reminder',
        {
            user_id: { type: Sequelize.INTEGER,references: {model: 'user',key: 'id'} },
            doctor_name: { type: Sequelize.STRING(50), notNull: true },
            date: { type: Sequelize.DATEONLY, notNull: true },
            address1: { type: Sequelize.STRING(50), notNull: true },
            address2: { type: Sequelize.STRING(50), notNull: true },
            city	: { type: Sequelize.STRING(50), notNull: true },
            state	: { type: Sequelize.STRING(50), notNull: true },
            pincode: { type: Sequelize.INTEGER, notNull: true },
            user_selected_time	: { type: Sequelize.TIME, notNull: true },
            status	: { type: Sequelize.BOOLEAN, notNull: true },
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'appointment_reminder',
        }
    );
    return AppointmentReminderModel;
};
