/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssetCategory, AssetEntity } from '@entities/asset';
import { SubmitOperationUseCase } from '@usecases/submit-operation/submit-operation-usecase';
import { IOperationFactory } from '@domain-ports/factories/operation-factory-interface';

import OperationRepositoryMock from '@test-mocks/operation-repository-mock';
import AssetRepositoryMock from '@test-mocks/asset-repository-mock';
import { OperationType, OperationEntity } from '@entities/operation';
import { UserEntity } from '@entities/user';
import { IUserRepository } from '@domain-ports/repositories/user-repository-interface';

class OperationFactoryMock implements IOperationFactory {
  constructor(private date: Date) {

  }

  make(
    value: number, quantity: number, type: OperationType,
    paper: AssetEntity, user: UserEntity, createdAt: string | Date, id: number,
  ): OperationEntity {
    return new OperationEntity(1, 15.95, 200, 'buy', new AssetEntity(1, 'TEST11', '', '', 'stock'), user, this.date);
  }
}

const date = new Date();
const user = new UserEntity('jbfjbkglkbnlknglkb', 'user', date, date);

class UserRepositoryMock implements IUserRepository {
  // eslint-disable-next-line class-methods-use-this
  signIn(username: string, password: string): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this
  async findUser(userId: string): Promise<UserEntity> {
    if (userId) {
      return user;
    }

    return undefined;
  }
}

describe('Submit Operation Use Case', () => {
  let submitOperationService : SubmitOperationUseCase;

  beforeEach(() => {
    submitOperationService = new SubmitOperationUseCase(
      new OperationRepositoryMock(),
      new AssetRepositoryMock(),
      new UserRepositoryMock(),
      new OperationFactoryMock(date),
    );
  });

  it('Should register an operation', async () => {
    const submitedOperation = await submitOperationService.submit({
      userId: user.id,
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
    expect(submitedOperation.user).toEqual(user);
  });

  it('Should throw an error when the paper not found', async () => {
    let error: Error;

    try {
      await submitOperationService.submit({
        userId: user.id,
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

  it('Should throw an error when the user not found', async () => {
    let error: Error;

    try {
      await submitOperationService.submit({
        userId: undefined,
        value: 15.95,
        quantity: 200,
        type: 'buy',
        assetCode: 'TEST11',
        createdAt: date,
      });
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.name).toBe('Error');
  });

  it('Should throw an error when required attributes are not entered', async () => {
    let error: Error;

    try {
      await submitOperationService.submit({} as any);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.name).toBe('Error');
  });
});
