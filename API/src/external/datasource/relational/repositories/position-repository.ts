import { Connection, Repository } from 'typeorm';
import { IPositionRepository } from '@domain-ports/repositories/position-repository-interface';
import { PositionEntity } from '@entities/position';
import {
  OperationModel, AssetModel, AssetQuoteModel, UserModel, UserCurrentPositionModel,
} from '@external/datasource/relational/models/';
import { IPositionFactory } from '@domain-ports/factories/position-factory-interface';
import { AssetEntity } from '@entities/asset/asset-entity';
import { UserEntity } from '@entities/user';
import { AssetCategory } from '@entities/asset';

export interface IPositionQueryRaw {
  id ?: string,
  quantity: string,
  price: string,
  date: string,
  asset_id: string,
  asset_code: string,
  asset_social: string,
  asset_logo: string,
  asset_category: string,
  user_id: string,
  user_name: string,
  user_createdAt: string,
  user_updatedAt: string,
}

export class PositionRepository implements IPositionRepository {
  private connection : Connection;

  private positionRepo : Repository<UserCurrentPositionModel>;

  constructor(connection: Connection, private positionFactory: IPositionFactory) {
    this.connection = connection;
  }

  formatPositions(raw: Array<IPositionQueryRaw>): Array<PositionEntity> {
    const positions = raw.map((element : IPositionQueryRaw) => {
      const asset = new AssetEntity(
        Number(element.asset_id),
        element.asset_code,
        element.asset_social,
        element.asset_logo,
        element.asset_category as AssetCategory,
      );

      const user = new UserEntity(
        element.user_id,
        element.user_name,
        new Date(element.user_createdAt),
        new Date(element.user_updatedAt),
      );

      return this.positionFactory.make(
        asset,
        user,
        Number(element.quantity),
        Number(element.price),
        element.date ? new Date(element.date) : new Date(),
        element.id ? Number(element.id) : undefined,
      );
    });

    return positions;
  }

  async getUserCurrentPositions(userId: string): Promise<PositionEntity[]> {
    const lastQuoteQuery = this.connection.createQueryBuilder()
      .select('max(sub_aq.date)')
      .from(AssetQuoteModel, 'sub_aq')
      .where('sub_aq.asset_id = a.id');

    const positionRaws = await this.connection.createQueryBuilder()
      .select([
        'ucp.id as id',
        'ucp.quantity as quantity',
        'u.id as user_id',
        'u.name as user_name',
        'u.created_at as user_createdAt',
        'u.updated_at as user_updatedAt',
        'a.id as asset_id',
        'a.code as asset_code',
        'a.social as asset_social',
        'a.logo as asset_logo',
        'a.category as asset_category',
        'aq.price as price',
        'aq.date as quote_date',
      ])
      .from(UserCurrentPositionModel, 'ucp')
      .innerJoin(UserModel, 'u', 'u.id = ucp.user_id')
      .innerJoin(AssetModel, 'a', 'a.id = ucp.asset_id')
      .innerJoin(AssetQuoteModel, 'aq', 'a.id = aq.asset_id')
      .where('u.id = :userId', { userId })
      .andWhere(`aq.date = (${lastQuoteQuery.getQuery()})`)
      .getRawMany();

    return this.formatPositions(positionRaws);
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

    return this.formatPositions(datasetReports);
  }
}

export default PositionRepository;
