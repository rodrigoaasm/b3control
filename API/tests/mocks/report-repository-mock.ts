import { IReportsRepository } from '@domain-ports/repositories/reports-repository-interface';
import { AssetEntity } from '@entities/asset';
import { PositionFactory } from '@entities/position';
import { PositionEntity } from '@entities/position/position-entity';
import DateValidatorUtil from '@utils/date-validator-util';

const assets: Array<AssetEntity> = [
  new AssetEntity(1, 'TEST11', '', '', 'stock'),
  new AssetEntity(1, 'TEST4', '', '', 'stock'),
  new AssetEntity(1, 'TEST3', '', '', 'general'),
];

export class ReportRepositoryMock implements IReportsRepository {
  private factory = new PositionFactory(new DateValidatorUtil());

  private positions: Array<PositionEntity> = [
    this.factory.make(assets[0], 200, 20, new Date('2021-01-31T00:00:00.000Z')),
    this.factory.make(assets[2], 100, 10, new Date('2021-01-31T00:00:00.000Z')),
    this.factory.make(assets[0], 200, 20, new Date('2021-02-28T00:00:00.000Z')),
    this.factory.make(assets[1], 150, 10, new Date('2021-02-28T00:00:00.000Z')),
    this.factory.make(assets[2], 50, 12, new Date('2021-02-28T00:00:00.000Z')),
    this.factory.make(assets[0], 240, 10, new Date('2021-03-30T00:00:00.000Z')),
    this.factory.make(assets[1], 140, 10, new Date('2021-03-30T00:00:00.000Z')),
  ];

  getAssetTimeseries(codes: string[], begin: Date, end: Date): Promise<PositionEntity[]> {
    return Promise.resolve(
      this.positions.filter((position: PositionEntity): boolean => (
        (!codes || codes.length === 0 || codes.includes(position.asset.code))
          && (!begin || position.date >= begin)
          && (!end || position.date <= end)
      )),
    );
  }
}

export default ReportRepositoryMock;
