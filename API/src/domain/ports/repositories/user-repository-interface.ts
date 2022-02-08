import { UserEntity } from '@entities/user';

export interface IUserRepository {
  findUser(userId: string): Promise<UserEntity>;
  signIn(username: string, password: string): Promise<UserEntity>;
}
