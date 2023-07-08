import {
  Connection, EntityManager, Repository, SelectQueryBuilder,
} from 'typeorm';
import { IPositionRepository } from '@domain-ports/repositories/position-repository-interface';
import { PositionEntity } from '@entities/position';
import {
  OperationModel, AssetModel, AssetQuoteModel, UserModel, UserCurrentPositionModel,
} from '@external/datasource/relational/models/';
import { IPositionFactory } from '@domain-ports/factories/position-factory-interface';
import { AssetEntity } from '@entities/asset/asset-entity';
import { UserEntity } from '@entities/user';
import { AssetCategory } from '@entities/asset';
import { ITypeORMRepository } from './typeorm-repositories-interface';

export interface IPositionQueryRaw {
  id ?: string,
  quantity: string,
  created_at?: string,
  updated_at?: string,
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
  average_buy_price: string,
}

export class PositionRepository implements IPositionRepository, ITypeORMRepository {
  private connection : Connection;

  private positionRepo : Repository<UserCurrentPositionModel>;

  constructor(connection: Connection, private positionFactory: IPositionFactory) {
    this.connection = connection;
    this.positionRepo = connection.getRepository(UserCurrentPositionModel);
  }

  setTransactionManager(transactionManager: EntityManager) {
    this.positionRepo = transactionManager.getRepository(UserCurrentPositionModel);
  }

  async saveUserCurrentPosition(userCurrentPosition: PositionEntity): Promise<void> {
    const user: UserModel = {
      id: userCurrentPosition.user.id,
      name: userCurrentPosition.user.name,
      createdAt: userCurrentPosition.user.createdAt,
      updatedAt: userCurrentPosition.user.updatedAt,
    };

    const asset: AssetModel = {
      id: userCurrentPosition.asset.id,
      code: userCurrentPosition.asset.code,
      category: userCurrentPosition.asset.category,
      logo: userCurrentPosition.asset.logo,
      social: userCurrentPosition.asset.social,
    };

    const userCurrentPositionModel: UserCurrentPositionModel = {
      user,
      asset,
      quantity: userCurrentPosition.quantity,
      createdAt: userCurrentPosition.date,
      updatedAt: new Date(),
      id: userCurrentPosition.id,
    };

    await this.positionRepo.save(userCurrentPositionModel);
  }

  private formatPosition(positionRaw: IPositionQueryRaw): PositionEntity {
    const asset = new AssetEntity(
      Number(positionRaw.asset_id),
      positionRaw.asset_code,
      positionRaw.asset_social,
      positionRaw.asset_logo,
      positionRaw.asset_category as AssetCategory,
    );

    const user = new UserEntity(
      positionRaw.user_id,
      positionRaw.user_name,
      new Date(positionRaw.user_createdAt),
      new Date(positionRaw.user_updatedAt),
    );

    return this.positionFactory.make(
      asset,
      user,
      positionRaw.quantity ? Number(positionRaw.quantity) : 0,
      Number(positionRaw.price),
      positionRaw.created_at ? new Date(positionRaw.created_at) : new Date(positionRaw.date),
      positionRaw.average_buy_price ? Number(positionRaw.average_buy_price) : 0,
      positionRaw.id ? Number(positionRaw.id) : undefined,
    );
  }

  private createLastQuoteQuery(): SelectQueryBuilder<any> {
    return this.connection.createQueryBuilder()
      .select('max(sub_aq.date)')
      .from(AssetQuoteModel, 'sub_aq')
      .where('sub_aq.asset_id = a.id');
  }

  private createQueryBaseForUserCurrentPositions(): SelectQueryBuilder<UserCurrentPositionModel> {
    return this.connection.createQueryBuilder()
      .select([
        'ucp.id as id',
        'ucp.quantity as quantity',
        'ucp.created_at as created_at',
        'ucp.updated_at as updated_at',
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
      .innerJoin(AssetQuoteModel, 'aq', 'a.id = aq.asset_id');
  }

  async getUserCurrentPosition(userId: string, assetId: number)
    : Promise<PositionEntity | undefined> {
    const lastQuoteQuery = this.createLastQuoteQuery();
    const positionRaw = await this.createQueryBaseForUserCurrentPositions()
      .where('u.id = :userId', { userId })
      .andWhere('a.id = :assetId', { assetId })
      .andWhere(`aq.date = (${lastQuoteQuery.getQuery()})`)
      .getRawOne();
    return positionRaw ? this.formatPosition(positionRaw) : positionRaw;
  }

  async getUserCurrentPositions(userId: string): Promise<PositionEntity[]> {
    const lastQuoteQuery = this.createLastQuoteQuery();
    const positionRaws = await this.createQueryBaseForUserCurrentPositions()
      .where('u.id = :userId', { userId })
      .andWhere(`aq.date = (${lastQuoteQuery.getQuery()})`)
      .getRawMany();

    return positionRaws.map(this.formatPosition.bind(this));
  }

  async getAssetTimeseries(
    userId: string, codes: string[], begin: Date, end: Date,
  ): Promise<PositionEntity[]> {
    let mainQuery = this.connection.createQueryBuilder();

    const positionQuery = this.connection.createQueryBuilder()
      .select('sum(op.quantity) as value')
      .from(OperationModel, 'op')
      .where('op.created_at <= sq.date and op.asset_id = sq.asset_id and op.user = :userId', { userId });

    const averageBuyPriceQuery = this.connection.createQueryBuilder()
      .select('round( (sum(op.value)/sum(op.quantity) )::numeric, 2) as value')
      .from(OperationModel, 'op')
      .where('op.type = \'buy\' and op.created_at <= sq.date and op.asset_id = sq.asset_id and op.user = :userId', { userId });

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
      `(${averageBuyPriceQuery.getQuery()}) as average_buy_price`,
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

    return datasetReports.map(this.formatPosition.bind(this));
  }
}

export default PositionRepository;
