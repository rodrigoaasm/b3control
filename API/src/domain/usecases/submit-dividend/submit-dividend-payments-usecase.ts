import { BadRequestError, NotFoundError } from '@domain-error/custom-error';
import { IDividendPaymentFactory } from '@domain-ports/factories/dividend-payment-factory-interface';

import { IAssetRepository } from '@domain-ports/repositories/asset-repository-interface';
import { IDividendPaymentRepository } from '@domain-ports/repositories/dividend-payment-repository-interface';
import { IUserRepository } from '@domain-ports/repositories/user-repository-interface';
import { ISubmitDividendPaymentInput, ISubmitDividendPaymentOutput, ISubmitDividendPaymentUseCase } from './submit-dividend-payments-interfaces';

export class SubmitDividendPaymentUseCase implements ISubmitDividendPaymentUseCase {
  constructor(
    private dividendPaymentRepository: IDividendPaymentRepository,
    private assetRepository: IAssetRepository,
    private userRepository: IUserRepository,
    private dividendPaymentFactory: IDividendPaymentFactory,
  ) {
  }

  public async submit(submitDividendPaymentInput: ISubmitDividendPaymentInput)
    : Promise<ISubmitDividendPaymentOutput> {
    const {
      userId, value, assetCode, createdAt,
    } = submitDividendPaymentInput;

    if (!(value && assetCode && createdAt)) {
      throw BadRequestError('Some required attribute was not found');
    }

    const user = await this.userRepository.findUser(userId);
    if (!user) throw NotFoundError('User not found');

    const asset = await this.assetRepository.findByCode(assetCode);
    if (!asset) throw NotFoundError('Asset not found');

    const payment = this.dividendPaymentFactory.make(user, value, asset, createdAt);
    const submitedPayment = await this.dividendPaymentRepository.save(payment);
    return submitedPayment;
  }
}

export default SubmitDividendPaymentUseCase;
