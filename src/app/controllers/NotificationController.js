import HelpNotification from '../schemas/HelpNotification';

class NotificationController {
  async index(req, res) {
    const notification = await HelpNotification.find({
      user: req.userId,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.json(notification);
  }

  async update(req, res) {
    const notification = await HelpNotification.findByIdAndUpdate(
      req.params.id,
      { answered: true },
      { new: true }
    );
    return res.json(notification);
  }
}

export default new NotificationController();
