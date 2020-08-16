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
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const date = new Date(2020, 4, 10, 13);
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
    const appointmentDate = new Date(2020, 4, 10, 11);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 10).getTime();
    });

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '1231231',
      user_id: '12312312',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '1231231',
        user_id: '1231231',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: '2312312',
        provider_id: '231231',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
