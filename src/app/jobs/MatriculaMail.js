import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class MatriculaMail {
  get key() {
    return 'MatriculaMail';
  }

  async handle({ data }) {
    const { matricula } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${matricula.student.name} <${matricula.student.email}>`,
      subject: 'Você está matriculado!',
      template: 'registration',
      context: {
        student: matricula.student.name,
        plano: matricula.plano.title,
        date: matricula.plano.duration,
        price: matricula.plano.price,
        start_date: format(parseISO(matricula.start_date), 'dd/MM/yyyy', {
          locale: pt,
        }),
        end_date: format(parseISO(matricula.end_date), 'dd/MM/yyyy', {
          locale: pt,
        }),
      },
    });
  }
}

export default new MatriculaMail();
