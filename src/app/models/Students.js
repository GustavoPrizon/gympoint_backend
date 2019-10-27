import Sequelize, { Model } from 'sequelize';

class Studenst extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        idade: Sequelize.INTEGER,
        altura: Sequelize.FLOAT,
        peso: Sequelize.FLOAT,
      },
      {
        sequelize,
      }
    );
  }
}

export default Studenst;
