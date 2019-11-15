module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('help_answers', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primarykey: true,
        allowNull: false,
      },
      student_id: {
        type: Sequelize.INTEGER,
        references: { model: 'students', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },
      question: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      answer: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      answer_at: {
        type: Sequelize.DATE,
        defaultValue: null,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('help_answers');
  },
};
