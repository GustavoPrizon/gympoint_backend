import { subDays } from 'date-fns';
import Students from '../models/Students';
import Checkins from '../models/Checkins';

const { Op } = require('sequelize');

class CheckinController {
  async store(req, res) {
    const student = await Students.findByPk(req.params.id);
    if (!student) {
      return res.status(401).json({ error: 'Students not exists.' });
    }

    const dateMax = subDays(new Date(), 7);
    const datevalidCheckin = await Checkins.findAll({
      where: {
        student_id: req.params.id,
        createdAt: {
          [Op.gte]: dateMax,
        },
      },
    });

    if (datevalidCheckin.length >= 5) {
      return res.status(401).json({ error: 'You already have 5 chckins.' });
    }

    const checkin = await Checkins.create({ student_id: req.params.id });

    return res.json({ student: student.name, checkin });
  }

  async index(req, res) {
    const student = await Students.findByPk(req.params.id);

    if (!student) {
      return res.status(401).json({ error: 'Students not exists.' });
    }

    if (req.query.week !== undefined) {
      const dateMax = subDays(new Date(), 7);
      const checkin = await Checkins.findAll({
        where: {
          student_id: req.params.id,
          createdAt: {
            [Op.gte]: dateMax,
          },
        },
      });

      return res.json({ student: student.name, checkin });
    }

    const checkin = await Checkins.findAll({
      where: {
        student_id: req.params.id,
      },
    });

    return res.json({ student: student.name, checkin });
  }
}

export default new CheckinController();
