import * as Yup from 'yup';
import Planos from '../models/Planos';

class PlanosController {
  async index(req, res) {
    const planos = await Planos.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
      order: ['duration'],
    });

    return res.json(planos);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const planosExists = await Planos.findOne({
      where: { title: req.body.title },
    });

    if (planosExists) {
      return res.status(400).json({ error: 'Plan already exists.' });
    }

    const { id, title, duration, price } = await Planos.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .required(),
      title: Yup.string(),
      duration: Yup.string(),
      price: Yup.number().integer(),
    });

    if (!(await schema.isValid({ ...req.body, id }))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { title } = req.body;

    const planos = await Planos.findByPk(id);

    if (title !== planos.title) {
      const planosExists = await Planos.findOne({
        where: { title },
      });

      if (planosExists) {
        return res.status(400).json({ error: 'Plan already exists.' });
      }
    }

    const { duration, price } = await planos.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const planos = await Planos.findByPk(req.params.id);

    if (!planos) {
      return res.status(401).json({ error: 'Plan not found.' });
    }

    await planos.destroy();

    return res.json(planos);
  }
}

export default new PlanosController();
