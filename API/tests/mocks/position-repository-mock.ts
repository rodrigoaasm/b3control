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
  new AssetEntity(3, 'TEST3', '', '', 'general'),
];

export class PositionRepositoryMock implements IPositionRepository {
  private factory = new PositionFactory(new DateValidatorUtil());

  private positions: Array<PositionEntity> = [
    this.factory.make(assets[0], defaultUser, 200, 20, new Date('2021-01-31T00:00:00.000Z')),
    this.factory.make(assets[2], defaultUser, 100, 10, new Date('2021-01-31T00:00:00.000Z')),
    this.factory.make(assets[0], defaultUser, 200, 20, new Date('2021-02-28T00:00:00.000Z')),
    this.factory.make(assets[1], defaultUser, 150, 10, new Date('2021-02-28T00:00:00.000Z')),
    this.factory.make(assets[2], defaultUser, 50, 12, new Date('2021-02-28T00:00:00.000Z')),
    this.factory.make(assets[0], defaultUser, 240, 10, new Date('2021-03-30T00:00:00.000Z')),
    this.factory.make(assets[1], defaultUser, 140, 10, new Date('2021-03-30T00:00:00.000Z')),
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
