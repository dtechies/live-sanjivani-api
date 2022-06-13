module.exports = (sequelize, Sequelize) => {
  const SymptomModel = sequelize.define(
    "symptom",
    {
      name: { type: Sequelize.STRING, notNull: true },
      age: { type: Sequelize.STRING, notNull: true },
      gender: {
        type: Sequelize.ENUM,
        values: ["male", "female", "other", "all"],
        notNull: true,
      },
      description: { type: Sequelize.STRING, notNull: true },
      how_common: { type: Sequelize.STRING, notNull: true },
      overview: { type: Sequelize.STRING, notNull: true },
      risk_factor: { type: Sequelize.STRING, notNull: false },
      diagnosed_by: { type: Sequelize.STRING, notNull: true },
      did_you_know: { type: Sequelize.STRING, notNull: false },
      facts: { type: Sequelize.STRING, notNull: false },
      treatment: { type: Sequelize.STRING, notNull: true },
      take_care_of_yourself: { type: Sequelize.STRING, notNull: true },
      made_wrose_by: { type: Sequelize.STRING, notNull: true },
      when_to_see_doctor: { type: Sequelize.STRING, notNull: true },
      question_to_ask: { type: Sequelize.STRING, notNull: false },
      what_to_expect: { type: Sequelize.STRING, notNull: true },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "symptom",
    }
  );
  return SymptomModel;
};
