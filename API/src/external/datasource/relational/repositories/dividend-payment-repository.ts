import { Connection, Repository } from 'typeorm';
import { AssetModel, DividendPaymentModel } from '@external/datasource/relational/models';
import { IDividendPaymentRepository } from '@domain-ports/repositories/dividend-payment-repository-interface';
import { DividendPaymentEntity } from '@entities/dividend-payment';
import { IDividendPaymentFactory } from '@domain-ports/factories/dividend-payment-factory-interface';

export class DividendPaymentRepository implements IDividendPaymentRepository {
  private repo: Repository<DividendPaymentModel>;

  constructor(
    private connection: Connection, private dividendPaymentFactory: IDividendPaymentFactory,
  ) {
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

  async getDividendPaymentsByMonth(codes: string[], begin: Date, end: Date): Promise<any[]> {
    const beginDate = begin ? begin.toISOString() : new Date().toISOString();
    const endDate = end ? end.toISOString() : new Date().toISOString();

    let mainQuery = this.connection.createQueryBuilder()
      .select([
        'a.code as code',
        'a.category as category',
        'a.social as social',
        'series.month as month',
        'coalesce(sum("dp"."value"),0) as value',
      ])
      .from(AssetModel, 'a')
      .innerJoin(
        `(select generate_series(timestamp '${beginDate}', timestamp '${endDate}', interval  '1 month') as month)`, 'series', 'true',
      )
      .leftJoin(DividendPaymentModel, 'dp', 'a.id = dp.asset_id  and dp.created_at >= series.month  and dp.created_at < (series.month + interval \'1 months\')');

    if (codes.length > 0) {
      mainQuery = mainQuery.where('a.code in (:...codes)', { codes });
    }

    mainQuery = mainQuery.addGroupBy('a.code, a.category, a.social, series.month')
      .orderBy('a.code, series.month', 'ASC');

    return mainQuery.getRawMany();
  }
}

export default DividendPaymentRepository;
