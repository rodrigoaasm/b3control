import { EntityConstructionError } from '@domain-error/custom-error';
import { IDateValidatorAdapter } from '@domain-ports/adapters/date-validator-adapter-interface';
import { IDividendPaymentFactory } from '@domain-ports/factories/dividend-payment-factory-interface';
import { AssetEntity } from '@entities/asset';
import { DividendPaymentEntity } from './dividend-payment-entity';

export class DividendPaymentFactory implements IDividendPaymentFactory {
  constructor(private dateValidatorAdapter: IDateValidatorAdapter) {

  }

  make(
    value: number,
    asset: AssetEntity,
    createdAt: Date | string,
    id: number = undefined,
  ): DividendPaymentEntity {
    if (!createdAt || !this.dateValidatorAdapter.validate(createdAt)) {
      throw EntityConstructionError('It was not possible create the dividend payments object!\n Date is invalid.');
    }

    const validCreatedAt = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;

    return new DividendPaymentEntity(id, value, asset, validCreatedAt);
  }
}

export default DividendPaymentFactory;
