import Students from '../models/Students';

class StudentsController {
  async store(req, res) {
    const student = await Students.create(req.body);

    return res.json(student);
  }
}

export default new StudentsController();
