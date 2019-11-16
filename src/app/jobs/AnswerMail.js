import Mail from '../../lib/Mail';

class AnswersMail {
  get key() {
    return 'AnswersMail';
  }

  async handle({ data }) {
    const { response } = data;

    console.log('A fila andou');

    await Mail.sendMail({
      to: `${response.student.name} <${response.student.mail}>`,
      subject: 'Pergunta respondida.',
      template: 'answer',
      context: {
        student: response.student.name,
        question: response.question,
        answer: response.answer,
      },
    });
  }
}

export default new AnswersMail();
