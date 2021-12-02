import { IReportsRepository } from '@domain-ports/repositories/reports-repository-interface';
import { AssetEntity } from '@entities/asset';
import { PositionFactory } from '@entities/position';
import { PositionEntity } from '@entities/position/position-entity';
import DateValidatorUtil from '@utils/date-validator-util';

const assets: Array<AssetEntity> = [
  new AssetEntity(1, 'TEST11', '', '', 'stock'),
  new AssetEntity(2, 'TEST4', '', '', 'stock'),
  new AssetEntity(3, 'TEST3', '', '', 'general'),
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

  private payments: Array<any> = [
    {
      code: assets[0].code, category: assets[0].category, month: new Date('2021-01-31T00:00:00.000Z'), value: 5.00,
    },
    {
      code: assets[0].code, category: assets[0].category, month: new Date('2021-02-28T00:00:00.000Z'), value: 5.00,
    },
    {
      code: assets[0].code, category: assets[0].category, month: new Date('2021-03-30T00:00:00.000Z'), value: 5.00,
    },
    {
      code: assets[1].code, category: assets[1].category, month: new Date('2021-01-31T00:00:00.000Z'), value: 7.00,
    },
    {
      code: assets[1].code, category: assets[1].category, month: new Date('2021-02-28T00:00:00.000Z'), value: 0.00,
    },
    {
      code: assets[1].code, category: assets[1].category, month: new Date('2021-03-30T00:00:00.000Z'), value: 7.00,
    },
    {
      code: assets[2].code, category: assets[2].category, month: new Date('2021-01-31T00:00:00.000Z'), value: 0.00,
    },
    {
      code: assets[2].code, category: assets[2].category, month: new Date('2021-02-28T00:00:00.000Z'), value: 0.00,
    },
    {
      code: assets[2].code, category: assets[2].category, month: new Date('2021-03-30T00:00:00.000Z'), value: 0.00,
    },
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

  getDividendPayments(codes: string[], begin: Date, end: Date): Promise<any[]> {
    return Promise.resolve(
      this.payments.filter((payment: any): boolean => (
        (!codes || codes.length === 0 || codes.includes(payment.code))
          && (!begin || payment.month >= begin)
          && (!end || payment.month <= end)
      )),
    );
  }
}

export default ReportRepositoryMock;
