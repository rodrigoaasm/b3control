import { BadRequestError, NotFoundError } from '@domain-error/custom-error';
import { IDividendPaymentFactory } from '@domain-ports/factories/dividend-payment-factory-interface';

import { IAssetRepository } from '@domain-ports/repositories/asset-repository-interface';
import { IDividendPaymentRepository } from '@domain-ports/repositories/dividend-payment-repository-interface';
import { ISubmitDividendPaymentInput, ISubmitDividendPaymentOutput, ISubmitDividendPaymentUseCase } from './submit-dividend-payments-interfaces';

export class SubmitDividendPaymentUseCase implements ISubmitDividendPaymentUseCase {
  constructor(
    private dividendPaymentRepository: IDividendPaymentRepository,
    private assetRepository: IAssetRepository,
    private dividendPaymentFactory: IDividendPaymentFactory,
  ) {
  }

  public async submit(submitDividendPaymentInput: ISubmitDividendPaymentInput)
    : Promise<ISubmitDividendPaymentOutput> {
    const {
      value, assetCode, createdAt,
    } = submitDividendPaymentInput;

    if (!(value && assetCode && createdAt)) {
      throw BadRequestError('A required attributes was not found');
    }

    const asset = await this.assetRepository.findByCode(assetCode);
    if (!asset) throw NotFoundError('Asset not found');

    const payment = this.dividendPaymentFactory.make(value, asset, createdAt);
    const submitedPayment = await this.dividendPaymentRepository.save(payment);
    return submitedPayment;
  }
}

export default SubmitDividendPaymentUseCase;
