import { ISignInResult, IUserRepository } from '@domain-ports/repositories/user-repository-interface';
import { UserEntity } from '@entities/user';
import { Connection, Repository } from 'typeorm';
import { UserModel } from '../models';

export class UserRepository implements IUserRepository {
  private repo: Repository<UserModel>;

  constructor(connection: Connection) {
    this.repo = connection.getRepository(UserModel);
  }

  async findUser(userId: string): Promise<UserEntity> {
    const userModel = await this.repo.findOne({ id: userId });

    return userModel ? new UserEntity(
      userModel.id,
      userModel.name,
      userModel.createdAt,
      userModel.updatedAt,
    ) : null;
  }

  async signIn(username: string): Promise<ISignInResult> {
    const userModel = await this.repo.findOne({
      select: ['id', 'name', 'password', 'createdAt', 'updatedAt'],
      where: [
        { name: username },
      ],
    });

    return userModel ? {
      user: new UserEntity(
        userModel.id,
        userModel.name,
        userModel.createdAt,
        userModel.updatedAt,
      ),
      password: userModel.password,
    } : null;
  }
}

export default UserRepository;
