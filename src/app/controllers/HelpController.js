import * as Yup from 'yup';
import HelpAnswers from '../models/HelpAnswers';
import Students from '../models/Students';
import Help from '../schemas/Help';

class HelpControllers {
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails.' });
    }

    const { id } = req.params;
    const { question } = req.body;

    const student = await Students.findByPk(id);
    if (!student) {
      return res.status(401).json({ error: 'Student not exists.' });
    }

    const help = await HelpAnswers.create({
      student_id: id,
      question,
    });

    /* Notification user Help */
    await Help.create({
      content: `Nova pergunta de ${student.name}.`,
    });

    return res.json({
      help,
      student: { student_id: id, student_name: student.name },
    });
  }

  async index(req, res) {
    const student = await Students.findByPk(req.params.id);
    if (!student) {
      return res.status(401).json({ error: 'Students not exists.' });
    }

    const help = await HelpAnswers.findAll({
      where: {
        student_id: req.params.id,
      },
    });

    return res.json({ student: student.name, help });
  }
}

export default new HelpControllers();
