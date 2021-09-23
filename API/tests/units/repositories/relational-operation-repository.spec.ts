import {
  Connection, createConnection, QueryRunner, getRepository, Repository,
} from 'typeorm';

import { IOperationFactory } from '@domain-ports/factories/ioperation-factory';
import OperationRepository from '@external/datasource/relational/repositories/operation-repository';
import { AssetEntity } from '@entities/asset';
import { OperationType, OperationEntity } from '@entities/operation';
import { OperationModel, OPERATION_TABLE_NAME } from '@external/datasource/relational/models/operation-model';
import config from '@test-setup/typeorm-setup';
import { AssetModel, ASSET_TABLE_NAME } from '@external/datasource/relational/models/asset-model';

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
  let operationRepository: OperationRepository;
  let operationRepositoryUtilTest: Repository<OperationModel>;
  let assetRepositoryUtilTest: Repository<AssetModel>;
  let date: Date;
  let queryRunner: QueryRunner;
  let asset: any;

  beforeEach(async () => {
    connection = await createConnection(config);
    queryRunner = connection.createQueryRunner();
    operationRepositoryUtilTest = getRepository(OperationModel);
    assetRepositoryUtilTest = getRepository(AssetModel);

    await queryRunner.query(`delete from ${OPERATION_TABLE_NAME}`);
    await queryRunner.query(`delete from ${ASSET_TABLE_NAME}`);
    asset = {
      code: 'TEST11',
      social: 'Teste',
      logo: '',
      category: 'stock',
    };
    asset = await assetRepositoryUtilTest.save(asset);
    date = new Date();

    operationRepository = new OperationRepository(new OperationFactoryMock());
  });

  afterEach(async () => {
    try {
      await queryRunner.query(`delete from ${OPERATION_TABLE_NAME}`);
      await queryRunner.query(`delete from ${ASSET_TABLE_NAME}`);
      await connection.close();
    // eslint-disable-next-line no-empty
    } catch (error) {}
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
    const persistedOperation = await operationRepositoryUtilTest.findOne(
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

  it('Should throw an error when the connection was closed', async () => {
    let error: Error;

    await connection.close();
    const operation = {
      value: 15.95,
      quantity: 200,
      type: 'buy' as OperationType,
      asset: {
        ...asset,
      } as AssetEntity,
      createdAt: date,
    };

    try {
      await operationRepository.save(operation);
    } catch (e) {
      error = e;
    }

    expect(error.name).toBe('TypeORMError');
  });
});
