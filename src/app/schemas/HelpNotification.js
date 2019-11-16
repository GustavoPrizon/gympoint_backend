import mongoose from 'mongoose';

const HelpNotificationSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: Number,
      default: 1,
    },
    answered: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('HelpNotification', HelpNotificationSchema);
