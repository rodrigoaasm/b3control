import { DividendPaymentEntity } from '@entities/dividend-payment';
import { UserEntity } from '@entities/user';

export interface ISubmitDividendPaymentInput {
  user: UserEntity,
  value : number,
  assetCode : string,
  createdAt : string | Date
}

export interface ISubmitDividendPaymentOutput extends DividendPaymentEntity{
}

export interface ISubmitDividendPaymentUseCase {
  submit(submitOperationInput: ISubmitDividendPaymentInput) : Promise<ISubmitDividendPaymentOutput>;
}
