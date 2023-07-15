import {
  Connection, EntityManager, Repository, SelectQueryBuilder,
} from 'typeorm';
import { IPositionRepository } from '@domain-ports/repositories/position-repository-interface';
import { PositionEntity, UserPositionEntity } from '@entities/position';
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
  investment_value: string,
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

  async saveUserCurrentPosition(userCurrentPosition: UserPositionEntity): Promise<void> {
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
      averageBuyPrice: userCurrentPosition.averageBuyPrice,
      investmentValue: userCurrentPosition.investmentValue,
      id: userCurrentPosition.id,
    };

    await this.positionRepo.save(userCurrentPositionModel);
  }

  async getUserCurrentPosition(userId: string, assetId: number)
    : Promise<UserPositionEntity | undefined> {
    const lastQuoteQuery = this.createLastQuoteQuery();
    const positionRaw = await this.createQueryBaseForUserCurrentPositions()
      .where('u.id = :userId', { userId })
      .andWhere('a.id = :assetId', { assetId })
      .andWhere(`aq.date = (${lastQuoteQuery.getQuery()})`)
      .getRawOne();
    return positionRaw ? this.toUserPosition(positionRaw) : positionRaw;
  }

  async getUserCurrentPositions(userId: string): Promise<PositionEntity[]> {
    const lastQuoteQuery = this.createLastQuoteQuery();
    const positionRaws = await this.createQueryBaseForUserCurrentPositions()
      .where('u.id = :userId', { userId })
      .andWhere(`aq.date = (${lastQuoteQuery.getQuery()})`)
      .getRawMany();

    return positionRaws.map(this.toUserPosition.bind(this));
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

    return datasetReports.map(this.toPosition.bind(this));
  }

  private static extractUser(positionRaw: IPositionQueryRaw): UserEntity {
    return new UserEntity(
      positionRaw.user_id,
      positionRaw.user_name,
      new Date(positionRaw.user_createdAt),
      new Date(positionRaw.user_updatedAt),
    );
  }

  private static extractAsset(positionRaw: IPositionQueryRaw): AssetEntity {
    return new AssetEntity(
      Number(positionRaw.asset_id),
      positionRaw.asset_code,
      positionRaw.asset_social,
      positionRaw.asset_logo,
      positionRaw.asset_category as AssetCategory,
    );
  }

  private toPosition(positionRaw: IPositionQueryRaw): PositionEntity {
    return this.positionFactory.make<PositionEntity>({
      clazzName: 'PositionEntity',
      asset: PositionRepository.extractAsset(positionRaw),
      user: PositionRepository.extractUser(positionRaw),
      quantity: positionRaw.quantity ? Number(positionRaw.quantity) : 0,
      date: positionRaw.created_at ? new Date(positionRaw.created_at) : new Date(positionRaw.date),
      price: Number(positionRaw.price),
      averageBuyPrice: positionRaw.average_buy_price ? Number(positionRaw.average_buy_price) : 0,
      investmentValue: Number(positionRaw.investment_value),
    });
  }

  private toUserPosition(positionRaw: IPositionQueryRaw): UserPositionEntity {
    return this.positionFactory.make<UserPositionEntity>({
      clazzName: 'UserPositionEntity',
      asset: PositionRepository.extractAsset(positionRaw),
      user: PositionRepository.extractUser(positionRaw),
      quantity: positionRaw.quantity ? Number(positionRaw.quantity) : 0,
      price: Number(positionRaw.price),
      date: positionRaw.created_at ? new Date(positionRaw.created_at) : new Date(positionRaw.date),
      averageBuyPrice: positionRaw.average_buy_price ? Number(positionRaw.average_buy_price) : 0,
      investmentValue: Number(positionRaw.investment_value),
      id: positionRaw.id ? Number(positionRaw.id) : undefined,
    });
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
        'ucp.average_buy_price as average_buy_price',
        'ucp.investment_value as investment_value',
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
}

export default PositionRepository;
