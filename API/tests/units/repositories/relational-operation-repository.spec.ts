import { Connection, createConnection, getRepository } from 'typeorm';

import { IOperationFactory } from '@domain-ports/factories/operation-factory-interface';
import OperationRepository from '@external/datasource/relational/repositories/operation-repository';
import { AssetEntity } from '@entities/asset';
import { OperationType, OperationEntity } from '@entities/operation';
import { OPERATION_TABLE_NAME, OperationModel } from '@external/datasource/relational/models/operation-model';
import config from '@test-setup/typeorm-setup';
import { PostgresMockDataSetup } from '@test-setup/postgres-mock-data';

class OperationFactoryMock implements IOperationFactory {
  // eslint-disable-next-line class-methods-use-this
  make(
    value: number,
    quantity: number,
    type: OperationType,
    asset: AssetEntity,
    createdAt: Date,
    id?: number,
  ): OperationEntity {
    return {
      value, quantity, type, asset, createdAt, id,
    };
  }
}

describe('Relational - Operation Repository', () => {
  let connection: Connection;
  let setup: PostgresMockDataSetup;
  let date: Date;
  let asset: any;
  let operationRepository: OperationRepository;

  beforeAll(async () => {
    connection = await createConnection(config);
    setup = new PostgresMockDataSetup(connection);
    const assets = await setup.load();
    [asset] = assets;
  });

  beforeEach(() => {
    date = new Date();
    operationRepository = new OperationRepository(new OperationFactoryMock());
  });

  afterAll(async () => {
    try {
      await setup.clear();
      await connection.close();
      // eslint-disable-next-line no-empty
    } catch (error) {}
  });

  afterEach(async () => {
    await setup.queryRunner.query(`delete from ${OPERATION_TABLE_NAME}`);
  });

  it('Should insert the entry in the database', async () => {
    const operation = {
      value: 15.95,
      quantity: 200,
      type: 'buy' as OperationType,
      asset: {
        ...asset,
      } as AssetEntity,
      createdAt: date,
    };

    const savedOperation = await operationRepository.save(operation);
    const persistedOperation = await getRepository(OperationModel).findOne(
      savedOperation.id, { relations: ['asset'] },
    );

    expect(savedOperation.id).toBeTruthy();
    expect(savedOperation).toEqual({
      ...operation,
      id: savedOperation.id,
    });
    expect(persistedOperation.asset.code).toEqual(asset.code);
    expect(persistedOperation.createdAt).toEqual(date);
    expect(persistedOperation.quantity).toEqual(operation.quantity);
    expect(persistedOperation.value).toEqual(operation.value);
    expect(persistedOperation.type).toEqual(operation.type);
  });

  it('Should throw an error when the asset does not exist in the database', async () => {
    let error: Error;

    const operation = {
      value: 15.95,
      quantity: 200,
      type: 'buy' as OperationType,
      asset: {
        category: 'general',
        code: 'TEST4',
        id: 2,
        logo: '',
        social: '',
      } as AssetEntity,
      createdAt: date,
    };

    try {
      await operationRepository.save(operation);
    } catch (e) {
      error = e;
    }

    expect(error.name).toBe('QueryFailedError');
  });

  it('Should throw an error when the operation value is invalid', async () => {
    let error: Error;

    const operation = {
      value: undefined,
      quantity: 200,
      type: 'buy' as OperationType,
      asset: {
        category: 'general',
        code: 'TEST4',
        id: 2,
        logo: '',
        social: '',
      } as AssetEntity,
      createdAt: date,
    };

    try {
      await operationRepository.save(operation);
    } catch (e) {
      error = e;
    }

    expect(error.name).toBe('QueryFailedError');
  });

  it('Should throw an error when the operation quantity is invalid', async () => {
    let error: Error;

    const operation = {
      value: 15.45,
      quantity: undefined,
      type: 'buy' as OperationType,
      asset: {
        category: 'general',
        code: 'TEST4',
        id: 2,
        logo: '',
        social: '',
      } as AssetEntity,
      createdAt: date,
    };

    try {
      await operationRepository.save(operation);
    } catch (e) {
      error = e;
    }

    expect(error.name).toBe('QueryFailedError');
  });

  it('Should throw an error when the operation type is invalid', async () => {
    let error: Error;

    const operation = {
      value: 15.45,
      quantity: 200,
      type: undefined,
      asset: {
        category: 'general',
        code: 'TEST4',
        id: 2,
        logo: '',
        social: '',
      } as AssetEntity,
      createdAt: date,
    };

    try {
      await operationRepository.save(operation);
    } catch (e) {
      error = e;
    }

    expect(error.name).toBe('QueryFailedError');
  });

  it('Should throw an error when the operation created date is invalid', async () => {
    let error: Error;

    const operation = {
      value: 15.45,
      quantity: 200,
      type: 'buy' as OperationType,
      asset: {
        category: 'general',
        code: 'TEST4',
        id: 2,
        logo: '',
        social: '',
      } as AssetEntity,
      createdAt: undefined,
    };

    try {
      await operationRepository.save(operation);
    } catch (e) {
      error = e;
    }

    expect(error.name).toBe('QueryFailedError');
  });
});
