/* eslint-disable no-underscore-dangle */
import { IOperationFactory } from '@domain-ports/factories/operation-factory-interface';
import OperationRepository from '@external/datasource/relational/repositories/operation-repository';
import { AssetEntity } from '@entities/asset';
import { OperationType, OperationEntity } from '@entities/operation';
import { QueryFailedError } from 'typeorm';
import { UserEntity } from '@entities/user';

const mockParentRepository = {
  save: jest.fn((object: any) => ({
    ...object,
    id: 1,
  })),
};

const connectionMock = {
  getRepository: () => mockParentRepository,
};

class OperationFactoryMock implements IOperationFactory {
  // eslint-disable-next-line class-methods-use-this
  make(
    value: number,
    quantity: number,
    type: OperationType,
    asset: AssetEntity,
    user: UserEntity,
    createdAt: Date,
    id?: number,
  ): OperationEntity {
    return new OperationEntity(id, value, quantity, type, asset, user, createdAt);
  }
}

describe('Relational - Operation Repository', () => {
  let date: Date;
  let asset: any;
  let operationRepository: OperationRepository;
  let user: UserEntity;

  beforeEach(() => {
    date = new Date();
    user = new UserEntity('jbfjbkglkbnlknglkb', 'user', date, date);
    asset = new AssetEntity(1, 'TEST11', 'Teste', '', 'stock');
    operationRepository = new OperationRepository(
      connectionMock as any, new OperationFactoryMock(),
    );
  });

  it('Should insert the entry in the database', async () => {
    const operation = new OperationEntity(undefined, 15.95, 200, 'buy', asset, user, date);

    const savedOperation = await operationRepository.save(operation);

    expect(savedOperation.id).toBeTruthy();
    expect(savedOperation).toEqual({
      ...operation,
      _id: savedOperation.id,
    });
  });

  it('Should throw an error when there is an transaction error in the database', async () => {
    let error: Error;
    mockParentRepository.save.mockImplementationOnce(() => {
      throw new QueryFailedError('', [], {});
    });

    const operation = new OperationEntity(undefined, 15.95, 200, 'buy', asset, user, date);
    try {
      await operationRepository.save(operation);
    } catch (e) {
      error = e;
    }

    expect(error.name).toBe('QueryFailedError');
  });
});
