import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to login with password and email', async () => {
    const user = await createUser.execute({
      name: 'joãozim',
      email: 'joaozim@email.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'joaozim@email.com',
      password: '123456',
    });

    await expect(response).toHaveProperty('token');
    await expect(response.user).toEqual(user);
  });

  it('should not be able to login with non existing email', async () => {
    await createUser.execute({
      name: 'joãozim',
      email: 'joaozim@email.com',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'wrong-email',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to login with an incorrect password', async () => {
    await createUser.execute({
      name: 'joãozim',
      email: 'joaozim@email.com',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'joaozim@email.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
