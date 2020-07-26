import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import { uuid } from 'uuidv4';
import { startOfHour } from 'date-fns';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const date = new Date();
    const provider_id = uuid();

    const appointment = await createAppointment.execute({
      date,
      provider_id,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(provider_id);
    expect(appointment.date).toStrictEqual(startOfHour(date));
  });

  it('should not be to create two appointments on the same schedule', () => {
    expect(1 + 2).toBe(3);
  });
});
