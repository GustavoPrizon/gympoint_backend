import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/Users';
import Students from '../app/models/Students';
import Planos from '../app/models/Planos';
import Matricula from '../app/models/Matriculas';
import Checkins from '../app/models/Checkins';
import HelpAnswers from '../app/models/HelpAnswers';

import databaseConfig from '../config/database';

const models = [User, Students, Planos, Matricula, Checkins, HelpAnswers];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/gympoint',
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
      }
    );
  }
}

export default new Database();
