import { UserRepository } from '@external/datasource/relational/repositories/user-repository';

const mockParentRepository = {
  findOne: jest.fn(),
};

const connectionMock = {
  getRepository: () => mockParentRepository,
};

describe('Relational - User Repository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository(connectionMock as any);
  });

  it('Should return a valid user by id', async () => {
    const date = new Date('2021-01-01T13:00:00.000Z');
    mockParentRepository.findOne.mockReturnValueOnce({
      id: 'userId',
      name: 'name',
      createdAt: date,
      updatedAt: date,
    });
    const user = await userRepository.findUser('userId');

    expect(user).toEqual({
      _id: 'userId',
      _name: 'name',
      _createdAt: date,
      _updatedAt: date,
    });
  });

  it('Should return null when there is no related user by id', async () => {
    mockParentRepository.findOne.mockReturnValueOnce(undefined);
    const user = await userRepository.findUser('userId');

    expect(user).toEqual(null);
  });

  it('Should return a valid user by credentials', async () => {
    const date = new Date('2021-01-01T13:00:00.000Z');
    mockParentRepository.findOne.mockReturnValueOnce({
      id: 'userId',
      name: 'name',
      createdAt: date,
      updatedAt: date,
    });
    const user = await userRepository.signIn('user', 'password');

    expect(user).toEqual({
      _id: 'userId',
      _name: 'name',
      _createdAt: date,
      _updatedAt: date,
    });
  });

  it('Should return null when there is no related user by credential', async () => {
    mockParentRepository.findOne.mockReturnValueOnce(undefined);
    const user = await userRepository.signIn('user', 'password');

    expect(user).toEqual(null);
  });
});
