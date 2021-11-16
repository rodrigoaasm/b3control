import { Connection } from 'typeorm';
import { IReportsRepository } from '@domain-ports/repositories/reports-repository-interface';
import { PositionEntity } from '@entities/position';
import { OperationModel, AssetModel, AssetQuoteModel } from '@external/datasource/relational/models/';
import { IPositionFactory } from '@domain-ports/factories/position-factory-interface';
import { AssetEntity } from '@entities/asset/asset-entity';

export class ReportsRepository implements IReportsRepository {
  private connection : Connection;

  constructor(connection: Connection, private positionFactory: IPositionFactory) {
    this.connection = connection;
  }

  async getAssetTimeseries(codes: string[], begin: Date, end: Date): Promise<PositionEntity[]> {
    let mainQuery = this.connection.createQueryBuilder();

    const positionQuery = this.connection.createQueryBuilder()
      .select('sum(op.quantity) as value')
      .from(OperationModel, 'op')
      .where('op.created_at <= sq.date and op.asset_id = sq.asset_id');

    mainQuery = mainQuery.select([
      'sq.date as date',
      's.id as asset_id',
      's.code as asset_code',
      's.social as asset_social',
      's.logo as asset_logo',
      's.category as asset_category',
      'sq.price as price',
      `(${positionQuery.getQuery()}) as quantity`,
    ])
      .from(AssetQuoteModel, 'sq')
      .innerJoin(AssetModel, 's', 's.id = sq.asset_id');

    if (begin && end) {
      mainQuery = mainQuery.where('sq.date >= :startDate', { startDate: begin })
        .andWhere('sq.date >= :endDate', { endDate: end });
    }

    if (codes.length > 0) {
      mainQuery = mainQuery.andWhere('s.code in (:...code)', { code: codes });
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

      return this.positionFactory.make(asset, element.quantity, element.price, element.date);
    });

    return positions;
  }
}

export default ReportsRepository;
