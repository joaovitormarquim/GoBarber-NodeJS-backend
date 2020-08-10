import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  it(`should be able to change user's avatar`, async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await await fakeUsersRepository.create({
      name: 'joãozim',
      email: 'joaozim@email.com',
      password: '123456',
    });

    const updatedUser = await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'foto-de-joãozim',
    });

    await expect(updatedUser.avatar).toEqual('foto-de-joãozim');
  });

  it('shold not be able to change avatar if user do not exists', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing user',
        avatarFilename: 'foto-de-joãozim',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it(`should delete previous avatar before update to the new avatar`, async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await await fakeUsersRepository.create({
      name: 'joãozim',
      email: 'joaozim@email.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'foto-de-joãozim',
    });

    const updatedUser = await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'nova-foto-de-joãozim',
    });

    await expect(deleteFile).toHaveBeenCalledWith('foto-de-joãozim');
    await expect(updatedUser.avatar).toEqual('nova-foto-de-joãozim');
  });
});
