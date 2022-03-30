import { UserEntity } from '@entities/user';

const now = new Date();

describe('User entity', () => {
  it('Should make a user entity', async () => {
    const user = new UserEntity('uuid', 'test', now, now);

    expect(user).toEqual({
      _id: 'uuid',
      _name: 'test',
      _createdAt: now,
      _updatedAt: now,
    });
  });

  it('Should throw an error when the id is undefined.', async () => {
    expect.assertions(1);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const user = new UserEntity(undefined, 'test', now, now);
    } catch (error) {
      expect(error.message).toEqual('It was not possible create the user object!\n The user id is undefined.');
    }
  });

  it('Should throw an error when the name is undefined.', async () => {
    expect.assertions(1);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const user = new UserEntity('uuid', undefined, now, now);
    } catch (error) {
      expect(error.message).toEqual('It was not possible create the user object!\n The username is undefined.');
    }
  });
});
