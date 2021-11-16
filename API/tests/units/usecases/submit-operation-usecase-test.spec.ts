/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssetCategory, AssetEntity } from '@entities/asset';
import { SubmitOperationUseCase } from '@usecases/submit-operation/submit-operation-usecase';
import { IOperationFactory } from '@domain-ports/factories/operation-factory-interface';

import OperationRepositoryMock from '@test-mocks/operation-repository-mock';
import AssetRepositoryMock from '@test-mocks/asset-repository-mock';
import { OperationType, OperationEntity } from '@entities/operation';
import { assert } from 'console';

class OperationFactoryMock implements IOperationFactory {
  constructor(private date: Date) {

  }

  make(
    value: number, quantity: number, type: OperationType,
    paper: AssetEntity, createdAt: string | Date, id: number,
  ): OperationEntity {
    return new OperationEntity(1, 15.95, 200, 'buy', new AssetEntity(1, 'TEST11', '', '', 'stock'), this.date);
  }
}

describe('Submit Operation Use Case', () => {
  let submitOperationService : SubmitOperationUseCase;
  let date: Date;

  beforeEach(() => {
    date = new Date();
    submitOperationService = new SubmitOperationUseCase(
      new OperationRepositoryMock(), new AssetRepositoryMock(), new OperationFactoryMock(date),
    );
  });

  it('Should register a operation', async () => {
    const submitedOperation = await submitOperationService.submit({
      value: 15.95,
      quantity: 200,
      type: 'buy',
      assetCode: 'TEST11',
      createdAt: date,
    });

    expect(submitedOperation.id).toEqual(1);
    expect(submitedOperation.value).toEqual(15.95);
    expect(submitedOperation.quantity).toEqual(200);
    expect(submitedOperation.type).toEqual('buy');
    expect(submitedOperation.asset.id).toEqual(1);
    expect(submitedOperation.asset.code).toEqual('TEST11');
    expect(submitedOperation.asset.social).toEqual('');
    expect(submitedOperation.asset.logo).toEqual('');
    expect(submitedOperation.asset.category).toEqual('stock');
    expect(submitedOperation.createdAt).toEqual(date);
  });

  it('Should throw a error when the paper not found', async () => {
    let error: Error;

    try {
      await submitOperationService.submit({
        value: 15.95,
        quantity: 200,
        type: 'buy',
        assetCode: 'TEST4',
        createdAt: date,
      });
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.name).toBe('Error');
  });
});
