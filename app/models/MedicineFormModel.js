module.exports = (sequelize, Sequelize) => {
    const MedicineFormModel = sequelize.define(
        'medicine_form',
        {
            name: { type: Sequelize.STRING(50), notNull: true },
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'medicine_form',
        }
    );
    return MedicineFormModel;
};
