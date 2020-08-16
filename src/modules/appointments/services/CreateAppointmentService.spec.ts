import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import { uuid } from 'uuidv4';
import { startOfHour, isEqual } from 'date-fns';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const date = new Date();
    const provider_id = uuid();
    const user_id = uuid();

    const appointment = await createAppointment.execute({
      date,
      provider_id,
      user_id,
    });

    await expect(appointment).toHaveProperty('id');
    await expect(appointment.provider_id).toBe(provider_id);
    await expect(appointment.user_id).toBe(user_id);
    await expect(isEqual(appointment.date, startOfHour(date))).toBe(true);
  });

  it('should not be to create two appointments on the same schedule', async () => {
    const date = new Date(2020, 4, 10, 11);

    await createAppointment.execute({
      date,
      provider_id: uuid(),
      user_id: uuid(),
    });

    await expect(
      createAppointment.execute({
        date,
        provider_id: uuid(),
        user_id: uuid(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
