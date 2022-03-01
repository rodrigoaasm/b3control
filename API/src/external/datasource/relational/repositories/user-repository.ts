import { IUserRepository } from '@domain-ports/repositories/user-repository-interface';
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

  async signIn(username: string, password: string): Promise<UserEntity> {
    const userModel = await this.repo.findOne({
      where: [
        { name: username },
        { password },
      ],
    });

    return userModel ? new UserEntity(
      userModel.id,
      userModel.name,
      userModel.createdAt,
      userModel.updatedAt,
    ) : null;
  }
}

export default UserRepository;
