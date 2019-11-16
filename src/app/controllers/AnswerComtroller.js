import * as Yup from 'yup';
import { Op } from 'sequelize';
import HelpAnswers from '../models/HelpAnswers';
import Students from '../models/Students';

import AnswerMail from '../jobs/AnswerMail';
import Queue from '../../lib/Queue';

class AnswerController {
  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validations fails.' });
    }

    const { id } = req.params;
    req.body.answer_at = new Date();

    const helpExists = await HelpAnswers.findByPk(id, {
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!helpExists) {
      return res.status(401).json({ error: 'Help not exists.' });
    }

    const response = await helpExists.update(req.body);

    await Queue.add(AnswerMail.key, {
      response,
    });

    return res.json(response);
  }

  async index(req, res) {
    if (req.query.history === undefined) {
      const response = await HelpAnswers.findAll({
        where: {
          answer: null,
        },
        include: [
          {
            model: Students,
            as: 'student',
            attributes: ['id', 'name'],
          },
        ],
      });

      return res.json(response);
    }

    const response = await HelpAnswers.findAll({
      where: {
        answer: {
          [Op.ne]: null,
        },
      },
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['id', 'name'],
        },
      ],
    });

    return res.json(response);
  }
}

export default new AnswerController();
