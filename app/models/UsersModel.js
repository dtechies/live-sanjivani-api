module.exports = (sequelize, Sequelize) => {
    const UsersModel = sequelize.define(
        'user',
        {
            first_name: { type: Sequelize.INTEGER, notNull: true },
            last_name	: { type: Sequelize.STRING, notNull: true },
            gender	: { type: Sequelize.STRING, notNull: true },
            dob	: { type: Sequelize.STRING, notNull: true },
            mob_no	: { type: Sequelize.STRING, notNull: true },
            language	: { type: Sequelize.STRING, notNull: true },
            is_medicine_reminder	: { type: Sequelize.STRING, notNull: true },
            is_appointment_reminder	: { type: Sequelize.STRING, notNull: true },
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'user',
        }
    );
    return UsersModel;
};
