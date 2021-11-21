import { DividendPaymentEntity } from '@entities/dividend-payment';

export interface ISubmitDividendPaymentInput {
  value : number,
  assetCode : string,
  createdAt : string | Date
}

export interface ISubmitDividendPaymentOutput extends DividendPaymentEntity{
}

export interface ISubmitDividendPaymentUseCase {
  submit(submitOperationInput: ISubmitDividendPaymentInput) : Promise<ISubmitDividendPaymentOutput>;
}
