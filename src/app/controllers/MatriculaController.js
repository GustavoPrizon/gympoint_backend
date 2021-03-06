import * as Yup from 'yup';
import { parseISO, addMonths, subDays, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Student from '../models/Students';
import Plano from '../models/Planos';
import Matricula from '../models/Matriculas';

import MatriculaMail from '../jobs/MatriculaMail';
import Queue from '../../lib/Queue';

const { Op } = require('sequelize');

class MatriculaController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .required(),
      plano_id: Yup.number()
        .integer()
        .required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails.' });
    }

    const { student_id, plano_id, start_date } = req.body;

    const studentPlano = await Plano.findByPk(plano_id);
    const { duration, price } = studentPlano;
    const totalPrice = duration * price;

    const parsedStartDate = parseISO(start_date);
    const parsedEndDate = subDays(addMonths(parsedStartDate, duration), 1);

    const matriculaExist = await Matricula.findOne({
      where: { student_id, end_date: { [Op.gte]: parsedEndDate } },
      order: ['end_date'],
      include: {
        model: Student,
        as: 'student',
        attributes: ['id', 'name', 'email'],
      },
    });

    if (matriculaExist !== null) {
      const { end_date, student } = matriculaExist;
      const formatDate = format(end_date, "dd 'de' MMM 'de' yyyy", {
        locale: pt,
      });
      return res.json({
        message: `The student ${student.name} was enrolled on the date ${formatDate}`,
      });
    }

    const matriculaSave = await Matricula.create({
      student_id,
      plano_id,
      price: totalPrice,
      start_date,
      end_date: parsedEndDate,
    });

    const matricula = await Matricula.findByPk(matriculaSave.id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
        {
          model: Plano,
          as: 'plano',
          attributes: ['title', 'duration', 'price'],
        },
      ],
    });

    // envia email
    await Queue.add(MatriculaMail.key, {
      matricula,
    });

    return res.json(matricula);
  }

  async index(req, res) {
    const matricula = await Matricula.findAll();

    return res.json(matricula);
  }

  async details(req, res) {
    const { id } = req.params;

    const matricula = await Matricula.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!matricula) {
      return res.status(401).json({ error: 'Matricula not exists.' });
    }

    return res.json(matricula);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().integer(),
      plano_id: Yup.number().integer(),
      start_date: Yup.date(),
      end_date: Yup.date(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails.' });
    }

    const { id } = req.params;

    let matricula = await Matricula.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!matricula) {
      return res.status(401).json({ error: 'Matricula not exists.' });
    }

    matricula = await matricula.update(req.body);

    return res.json(matricula);
  }

  async delete(req, res) {
    const matricula = await Matricula.findByPk(req.params.id);

    if (!matricula) {
      return res.status(401).json({ error: 'Matricula not exists.' });
    }

    await matricula.destroy();

    return res.json(matricula);
  }
}

export default new MatriculaController();
