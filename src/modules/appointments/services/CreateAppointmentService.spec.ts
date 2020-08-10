import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import { uuid } from 'uuidv4';
import { startOfHour, isEqual } from 'date-fns';
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

    await expect(appointment).toHaveProperty('id');
    await expect(appointment.provider_id).toBe(provider_id);
    await expect(isEqual(appointment.date, startOfHour(date))).toBe(true);
  });

  it('should not be to create two appointments on the same schedule', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const date = new Date(2020, 4, 10, 11);

    await createAppointment.execute({
      date,
      provider_id: uuid(),
    });

    await expect(
      createAppointment.execute({
        date,
        provider_id: uuid(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
