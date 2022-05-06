module.exports = (sequelize, Sequelize) => {
    const DoctorsModel = sequelize.define(
        'doctors',
        {
            doctor_name: { type: Sequelize.STRING(50), notNull: true },
            speciality	: { type: Sequelize.STRING(50), notNull: true },
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'doctors',
        }
    );
    DoctorsModel.associate =(models) => {
        DoctorsModel.hasMany(models.MedicineReminderModel, {
          foreignKey: 'doctor_id'
        });
      }
    return DoctorsModel;
};
