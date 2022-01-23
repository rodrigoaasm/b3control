import { OperationEntity } from '@entities/operation/';
import { UserEntity } from '@entities/user';

export interface ISubmitOperationInput {
  user: UserEntity,
  value : number,
  quantity : number,
  type : 'buy' | 'sale',
  assetCode : string,
  createdAt : string | Date
}

export interface ISubmitOperationOutput extends OperationEntity{
}

export interface ISubmitOperationUseCase {
  submit(submitOperationInput: ISubmitOperationInput) : Promise<ISubmitOperationOutput>;
}
