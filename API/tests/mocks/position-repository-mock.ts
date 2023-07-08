/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IPositionRepository } from '@domain-ports/repositories/position-repository-interface';
import { AssetEntity } from '@entities/asset';
import { PositionFactory } from '@entities/position';
import { PositionEntity } from '@entities/position/position-entity';
import { UserEntity } from '@entities/user';
import DateValidatorUtil from '@utils/date-handler-util';

const date = new Date();
const defaultUser = new UserEntity('jbfjbkglkbnlknglkb', 'user', date, date);
const assets: Array<AssetEntity> = [
  new AssetEntity(1, 'TEST11', '', '', 'stock'),
  new AssetEntity(2, 'TEST4', '', '', 'stock'),
  new AssetEntity(3, 'TEST3', '', '', 'FII'),
];

export class PositionRepositoryMock implements IPositionRepository {
  private factory = new PositionFactory(new DateValidatorUtil());

  getUserCurrentPosition(userId: string, assetId: number): Promise<PositionEntity> {
    throw new Error('Method not implemented.');
  }

  saveUserCurrentPosition(userCurrentPosition: PositionEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private positions: Array<PositionEntity> = [
    this.factory.make<PositionEntity>({
      clazzName: 'PositionEntity', asset: assets[0], user: defaultUser, quantity: 200, price: 20, date: new Date('2021-01-31T00:00:00.000Z'),
    }),
    this.factory.make<PositionEntity>({
      clazzName: 'PositionEntity', asset: assets[2], user: defaultUser, quantity: 100, price: 10, date: new Date('2021-01-31T00:00:00.000Z'),
    }),
    this.factory.make<PositionEntity>({
      clazzName: 'PositionEntity', asset: assets[0], user: defaultUser, quantity: 200, price: 20, date: new Date('2021-02-28T00:00:00.000Z'),
    }),
    this.factory.make<PositionEntity>({
      clazzName: 'PositionEntity', asset: assets[1], user: defaultUser, quantity: 150, price: 10, date: new Date('2021-02-28T00:00:00.000Z'),
    }),
    this.factory.make<PositionEntity>({
      clazzName: 'PositionEntity', asset: assets[2], user: defaultUser, quantity: 50, price: 12, date: new Date('2021-02-28T00:00:00.000Z'),
    }),
    this.factory.make<PositionEntity>({
      clazzName: 'PositionEntity', asset: assets[0], user: defaultUser, quantity: 240, price: 10, date: new Date('2021-03-30T00:00:00.000Z'),
    }),
    this.factory.make<PositionEntity>({
      clazzName: 'PositionEntity', asset: assets[1], user: defaultUser, quantity: 140, price: 10, date: new Date('2021-03-30T00:00:00.000Z'),
    }),
  ];

  // eslint-disable-next-line class-methods-use-this
  getUserCurrentPositions(userId: string): Promise<PositionEntity[]> {
    throw new Error('Method not implemented.');
  }

  getAssetTimeseries(
    userId: string, codes: string[], begin: Date, end: Date,
  ): Promise<PositionEntity[]> {
    return Promise.resolve(
      this.positions.filter((position: PositionEntity): boolean => (
        userId === position.user.id
          && (!codes || codes.length === 0 || codes.includes(position.asset.code))
          && (!begin || position.date >= begin)
          && (!end || position.date <= end)
      )),
    );
  }
}

export default PositionRepositoryMock;
