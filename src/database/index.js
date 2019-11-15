import Sequelize from 'sequelize';

import User from '../app/models/Users';
import Students from '../app/models/Students';
import Planos from '../app/models/Planos';
import Matricula from '../app/models/Matriculas';

import databaseConfig from '../config/database';

const models = [User, Students, Planos, Matricula];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
