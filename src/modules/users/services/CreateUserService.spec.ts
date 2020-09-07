import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let cacheProvider: FakeCacheProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    cacheProvider = new FakeCacheProvider();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      cacheProvider,
    );
  });
  it('should be able to create a new appointment', async () => {
    const user = await createUser.execute({
      name: 'Joãozim',
      email: 'joaozim@email.com',
      password: '123456',
    });

    await expect(user).toHaveProperty('id');
    await expect(user.name).toBe('Joãozim');
    await expect(user.email).toBe('joaozim@email.com');
  });

  it('should not be able to create an user with an email that already exists', async () => {
    await createUser.execute({
      name: 'Joãozim',
      email: 'joaozim@email.com',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'Joãozim',
        email: 'joaozim@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
