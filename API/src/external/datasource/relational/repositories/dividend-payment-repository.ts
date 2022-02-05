import { Connection, Repository } from 'typeorm';
import { AssetModel, DividendPaymentModel } from '@external/datasource/relational/models';
import { IDividendPaymentRepository } from '@domain-ports/repositories/dividend-payment-repository-interface';
import { DividendPaymentEntity } from '@entities/dividend-payment';
import { IDividendPaymentFactory } from '@domain-ports/factories/dividend-payment-factory-interface';
import { UserEntity } from '@entities/user';

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
      user: {
        id: payment.user.id,
        name: payment.user.name,
        createdAt: payment.user.createdAt,
        updatedAt: payment.user.updatedAt,
      },
    };

    const {
      value, id, createdAt, user: userModel,
    } = await this.repo.save(entity);

    const userEntity = new UserEntity(
      userModel.id,
      userModel.name,
      userModel.createdAt,
      userModel.updatedAt,
    );

    return this.dividendPaymentFactory.make(
      userEntity, value, payment.asset, createdAt, id,
    );
  }

  async getDividendPaymentsByMonth(
    userId: string, codes: string[], begin: Date, end: Date,
  ): Promise<any[]> {
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
        `(select generate_series(timestamp '${begin.toDateString()}', timestamp '${end.toDateString()}', interval  '1 month') as month)`, 'series', 'true',
      )
      .leftJoin(DividendPaymentModel, 'dp', 'a.id = dp.asset_id  and dp.created_at >= series.month  and dp.created_at < (series.month + interval \'1 months\')')
      .where('dp.user_id = :userId', { userId });

    if (codes.length > 0) {
      mainQuery = mainQuery.andWhere('a.code in (:...codes)', { codes });
    }

    mainQuery = mainQuery.addGroupBy('a.code, a.category, a.social, series.month')
      .orderBy('a.code, series.month', 'ASC');

    const raws = await mainQuery.getRawMany();

    return raws.map((raw) => ({
      ...raw,
      value: Number(raw.value),
    }));
  }
}

export default DividendPaymentRepository;
