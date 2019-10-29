import * as Yup from 'yup';
import Students from '../models/Students';

class StudentsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      idade: Yup.number()
        .integer()
        .required(),
      altura: Yup.number().required(),
      peso: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const studentsExists = await Students.findOne({
      where: { email: req.body.email },
    });

    if (studentsExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const { id, name, email, idade, altura, peso } = await Students.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      idade,
      altura,
      peso,
    });
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .required(),
      name: Yup.string(),
      email: Yup.string().email(),
      idade: Yup.number().integer(),
      altura: Yup.number(),
      peso: Yup.number(),
    });

    if (!(await schema.isValid({ ...req.body, id }))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const student = await Students.findByPk(id);

    if (email !== student.email) {
      const studentsExists = await Students.findOne({
        where: { email },
      });

      if (studentsExists) {
        return res.status(400).json({ error: 'Student already exists.' });
      }
    }

    const { name, idade, altura, peso } = await student.update(req.body);

    return res.json({
      id,
      name,
      email,
      idade,
      altura,
      peso,
    });
  }
}

export default new StudentsController();
