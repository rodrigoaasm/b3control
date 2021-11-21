import { Connection, Repository } from 'typeorm';
import { DividendPaymentModel } from '@external/datasource/relational/models';
import { IDividendPaymentRepository } from '@domain-ports/repositories/dividend-payment-repository-interface';
import { DividendPaymentEntity } from '@entities/dividend-payment';
import { IDividendPaymentFactory } from '@domain-ports/factories/dividend-payment-factory-interface';

export class DividendPaymentRepository implements IDividendPaymentRepository {
  private repo: Repository<DividendPaymentModel>;

  constructor(connection: Connection, private dividendPaymentFactory: IDividendPaymentFactory) {
    this.repo = connection.getRepository(DividendPaymentModel);
  }

  async save(payment: DividendPaymentEntity): Promise<DividendPaymentEntity> {
    const entity: DividendPaymentModel = {
      asset: payment.asset,
      value: payment.value,
      createdAt: payment.createdAt,
    };

    const {
      value, id, createdAt,
    } = await this.repo.save(entity);

    return this.dividendPaymentFactory.make(
      value, payment.asset, createdAt, id,
    );
  }
}

export default DividendPaymentRepository;
