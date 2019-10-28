import Students from '../models/Students';

class StudentsController {
  async store(req, res) {
    const studentsExists = await Students.findOne({
      where: { email: req.body.email },
    });

    if (studentsExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const student = await Students.create(req.body);

    return res.json(student);
  }
}

export default new StudentsController();
