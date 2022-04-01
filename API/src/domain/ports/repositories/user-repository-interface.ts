import { UserEntity } from '@entities/user';

export interface ISignInResult {
  user: UserEntity,
  password: string,
}

export interface IUserRepository {
  findUser(userId: string): Promise<UserEntity>;
  signIn(username: string): Promise<ISignInResult>;
}

export default IUserRepository;
