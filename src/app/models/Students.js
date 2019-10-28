import Sequelize, { Model } from 'sequelize';

class Students extends Model {
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

export default Students;
