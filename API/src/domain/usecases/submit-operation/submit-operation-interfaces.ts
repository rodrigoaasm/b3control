import { OperationEntity } from '@entities/operation/';

export interface ISubmitOperationInput {
  userId: string,
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
