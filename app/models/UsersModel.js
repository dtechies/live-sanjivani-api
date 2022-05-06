module.exports = (sequelize, Sequelize) => {
    const UsersModel = sequelize.define(
        'user',
        {
            first_name: { type: Sequelize.STRING(50), notNull: true },
            last_name	: { type: Sequelize.STRING(50), notNull: true },
            gender	: { type: Sequelize.STRING(10), notNull: true },
            dob	: { type: Sequelize.DATEONLY, notNull: true },
            email	: { type: Sequelize.STRING(50), notNull: true },
            mob_no	: { type: Sequelize.STRING(13), notNull: true , unique: true},
            language	: { type: Sequelize.STRING(50), notNull: true },
            is_medicine_reminder	: { type: Sequelize.TINYINT(1), notNull: true },
            is_appointment_reminder	: { type: Sequelize.TINYINT(1), notNull: true },
             otp: { type: Sequelize.STRING },
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'user',
        }
    );
     UsersModel.associate =(models) => {
        UsersModel.hasMany(models.AppointmentReminderModel, {
          foreignKey: 'user_id',
            // sourceKey:'user_id'
        })
         UsersModel.hasMany(models.FavoriteModel, {
          foreignKey: 'user_id',
          // sourceKey:'user_id'
        })
         UsersModel.hasMany(models.MedicalJournalNoteModel, {
          foreignKey: 'user_id',
         //  sourceKey:'user_id'
        })
       
        
      }
    return UsersModel;
};
