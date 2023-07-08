import { AssetModel, UserCurrentPositionModel, UserModel } from '@external/datasource/relational/models';
import { Connection } from 'typeorm';
import { PostgresDataSetup } from './postgres-data-setup';

export class PostgresQueryExec {
  private connection: Connection;

  constructor(postgresDataSetup: PostgresDataSetup) {
    this.connection = postgresDataSetup.getConnection();
  }

  getUserCurrentPosition(assetCode: string, userId: string): Promise<UserCurrentPositionModel[]> {
    return this.connection.createQueryBuilder()
      .select(['ucp.id', 'ucp.quantity', 'ucp.investment_value', 'ucp.average_buy_price'])
      .from(UserCurrentPositionModel, 'ucp')
      .innerJoin(UserModel, 'u', 'u.id = ucp.user_id')
      .innerJoin(AssetModel, 'a', 'a.id = ucp.asset_id')
      .where('u.id = :userId', { userId })
      .andWhere('a.code = :assetCode', { assetCode })
      .getMany();
  }
}

export default PostgresQueryExec;
