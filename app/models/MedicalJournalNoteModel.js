module.exports = (sequelize, Sequelize) => {
    const MedicalJournalNoteModel = sequelize.define(
        'medical_journal_note',
        {
            user_id: { type: Sequelize.INTEGER,references: {model: 'user',key: 'id'} },
            name: { type: Sequelize.STRING(50), notNull: true },
        },
        {
            timestamps: true,
            underscored: true,
            tableName: 'medical_journal_note',
        }
    );
    return MedicalJournalNoteModel;
};
