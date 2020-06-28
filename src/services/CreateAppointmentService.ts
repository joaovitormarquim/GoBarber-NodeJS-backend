import { startOfHour } from 'date-fns';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  private appointmentsRepository: AppointmentsRepository;

  constructor(appointmentsRepository: AppointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public execute({ date, provider }: Request): Appointment {
    const appointmenDate = startOfHour(date);

    const findAppointmentInSameDate = this.appointmentsRepository.findByDate(
      appointmenDate,
    );

    if (findAppointmentInSameDate) {
      throw Error('This appointment is alreay booked');
    }

    const appointment = this.appointmentsRepository.create({
      provider,
      date: appointmenDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
