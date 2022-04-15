module.exports = (sequelize, Sequelize) => {
    const MedicineStrengthModel = sequelize.define(
        'medicine_strength',
        {
            unit: { type: Sequelize.STRING(50), notNull: true }
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'medicine_strength',
        }
    );
    return MedicineStrengthModel;
};
