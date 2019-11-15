import mongoose from 'mongoose';

const AnswersSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
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

export default mongoose.model('Answers', AnswersSchema);
