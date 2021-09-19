import { OperationEntity } from '@entities/operation/';

export interface ISubmitOperationInput {
  value : number,
  quantity : number,
  type : 'buy' | 'sale',
  assetCode : string,
  createdAt : string | Date
}

export interface ISubmitOperationUseCase {
  submit(submitOperationInput: ISubmitOperationInput) : Promise<OperationEntity>;
}
