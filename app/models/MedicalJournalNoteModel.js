module.exports = (sequelize, Sequelize) => {
  const MedicalJournalNoteModel = sequelize.define(
    "medical_journal_note",
    {
      // user_id: { type: Sequelize.INTEGER,references: {model: 'user',key: 'id'} },
      date: { type: Sequelize.STRING(50), notNull: false },
      time: { type: Sequelize.STRING(50), notNull: false },
      description: { type: Sequelize.STRING(50), notNull: false },
      image: { type: Sequelize.STRING(200), notNull: false },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "medical_journal_note",
    }
  );
  MedicalJournalNoteModel.associate = (models) => {
    MedicalJournalNoteModel.belongsTo(models.UsersModel, {
      foreignKey: "user_id",
      // targetKey: 'user_id'
    });
  };
  return MedicalJournalNoteModel;
};
