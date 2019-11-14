import Sequelize, { Model } from 'sequelize';

class Matricula extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
        plano_id: Sequelize.INTEGER,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.FLOAT,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Students, {
      foreignKey: 'student_id',
      as: 'student',
    });
    this.belongsTo(models.Planos, {
      foreignKey: 'plano_id',
      as: 'plano',
    });
  }
}

export default Matricula;
