import { Connection } from 'typeorm';
import { IPositionRepository } from '@domain-ports/repositories/position-repository-interface';
import { PositionEntity } from '@entities/position';
import {
  OperationModel, AssetModel, AssetQuoteModel, UserModel,
} from '@external/datasource/relational/models/';
import { IPositionFactory } from '@domain-ports/factories/position-factory-interface';
import { AssetEntity } from '@entities/asset/asset-entity';
import { UserEntity } from '@entities/user';

export class PositionRepository implements IPositionRepository {
  private connection : Connection;

  constructor(connection: Connection, private positionFactory: IPositionFactory) {
    this.connection = connection;
  }

  async getAssetTimeseries(
    userId: string, codes: string[], begin: Date, end: Date,
  ): Promise<PositionEntity[]> {
    let mainQuery = this.connection.createQueryBuilder();

    const positionQuery = this.connection.createQueryBuilder()
      .select('sum(op.quantity) as value')
      .from(OperationModel, 'op')
      .where('op.created_at <= sq.date and op.asset_id = sq.asset_id and op.user = :userId', { userId });

    mainQuery = mainQuery.select([
      'sq.date as date',
      's.id as asset_id',
      's.code as asset_code',
      's.social as asset_social',
      's.logo as asset_logo',
      's.category as asset_category',
      'sq.price as price',
      'u.id as user_id',
      'u.name as user_name',
      'u.createdAt as user_createdAt',
      'u.updatedAt as user_updatedAt',
      `(${positionQuery.getQuery()}) as quantity`,
    ])
      .from(AssetQuoteModel, 'sq')
      .innerJoin(AssetModel, 's', 's.id = sq.asset_id')
      .innerJoin(UserModel, 'u', 'u.id = :userId', { userId })
      .where('u.id = :userId', { userId });

    if (begin) {
      mainQuery = mainQuery.andWhere('sq.date >= :startDate', { startDate: begin });
    }

    if (end) {
      mainQuery = mainQuery.andWhere('sq.date <= :endDate', { endDate: end });
    }

    if (codes.length > 0) {
      mainQuery = mainQuery.andWhere('s.code in (:...codes)', { codes });
    }

    mainQuery = mainQuery.orderBy('s.id, sq.date', 'ASC');
    const datasetReports = await mainQuery.getRawMany();

    const positions = datasetReports.map((element : any) => {
      const asset = new AssetEntity(
        element.asset_id,
        element.asset_code,
        element.asset_social,
        element.asset_logo,
        element.asset_category,
      );
      const user = new UserEntity(
        element.user_id,
        element.user_name,
        new Date(element.user_createdAt),
        new Date(element.user_updatedAt),
      );

      return this.positionFactory.make(asset, user, element.quantity, element.price, element.date);
    });

    return positions;
  }
}

export default PositionRepository;
