/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssetEntity } from '@entities/asset';
import { SubmitOperationUseCase } from '@usecases/submit-operation/submit-operation-usecase';
import { IOperationFactory } from '@domain-ports/factories/operation-factory-interface';

import OperationRepositoryMock from '@test-mocks/operation-repository-mock';
import AssetRepositoryMock from '@test-mocks/asset-repository-mock';
import { OperationType, OperationEntity } from '@entities/operation';
import { UserEntity } from '@entities/user';
import { ISignInResult, IUserRepository } from '@domain-ports/repositories/user-repository-interface';
import { IPositionFactory } from '@domain-ports/factories/position-factory-interface';
import { PositionEntity } from '@entities/position';
import { IPositionRepository } from '@domain-ports/repositories/position-repository-interface';
import { IUnitOfWork } from '@domain-ports/unit-work-interface';

class OperationFactoryMock implements IOperationFactory {
  constructor(private date: Date) {}

  make(
    value: number, quantity: number, type: OperationType,
    paper: AssetEntity, user: UserEntity, createdAt: string | Date, id: number,
  ): OperationEntity {
    return new OperationEntity(1, 15.95, 200, 'buy', new AssetEntity(1, 'TEST11', '', '', 'stock'), user, this.date);
  }
}

class PositionFactoryMock implements IPositionFactory {
  constructor(private date: Date) {}

  make(
    asset: AssetEntity, user: UserEntity, quantity: number,
    price: number, date: Date, averageBuyPrice: number = 0, id: number = 1,
  ): PositionEntity {
    return new PositionEntity(asset, user, quantity, this.date, price, averageBuyPrice, id);
  }
}

const date = new Date();
const user = new UserEntity('jbfjbkglkbnlknglkb', 'user', date, date);

class UserRepositoryMock implements IUserRepository {
  // eslint-disable-next-line class-methods-use-this
  signIn(username: string): Promise<ISignInResult> {
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

class PositionRepositoryMock implements IPositionRepository {
  getAssetTimeseries = jest.fn();

  setTransactionManager = jest.fn();

  getUserCurrentPositions = jest.fn();

  getUserCurrentPosition = jest.fn();

  saveUserCurrentPosition = jest.fn();
}

describe('Submit Operation Use Case', () => {
  let submitOperationService: SubmitOperationUseCase;
  let positionRepositoryMock: PositionRepositoryMock;
  let operationRepositoryMock: OperationRepositoryMock;
  let mockUnitOfWork: IUnitOfWork;

  beforeEach(() => {
    positionRepositoryMock = new PositionRepositoryMock();
    operationRepositoryMock = new OperationRepositoryMock();

    mockUnitOfWork = {
      runTransaction: jest.fn().mockImplementation((work: Function) => work()),
      getPositionRepository: () => positionRepositoryMock,
      getOperationRepository: () => operationRepositoryMock,
      kill: jest.fn(),
    };
    const unitOfWorkFactory = {
      make: () => mockUnitOfWork,
    };

    submitOperationService = new SubmitOperationUseCase(
      new AssetRepositoryMock(),
      new UserRepositoryMock(),
      new OperationFactoryMock(date),
      new PositionFactoryMock(date),
      unitOfWorkFactory,
    );
  });

  it('Should register an operation when there is no current position', async () => {
    const submitedOperation = await submitOperationService.submit({
      userId: user.id,
      value: 15.95,
      quantity: 200,
      type: 'buy',
      assetCode: 'TEST11',
      createdAt: date,
    });

    expect(positionRepositoryMock.saveUserCurrentPosition.mock.calls[0]).toEqual([{
      _asset: {
        _category: 'stock',
        _code: 'TEST11',
        _id: 1,
        _logo: '',
        _social: 'Teste',
      },
      _averageBuyPrice: 0,
      _date: date,
      _id: 1,
      _price: 0,
      _quantity: 200,
      _user: {
        _createdAt: date,
        _id: 'jbfjbkglkbnlknglkb',
        _name: 'user',
        _updatedAt: date,
      },
    }]);

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

  it('Should register an operation when there is a current position', async () => {
    positionRepositoryMock.getUserCurrentPosition.mockResolvedValueOnce({
      quantity: 100,
    });

    const submitedOperation = await submitOperationService.submit({
      userId: user.id,
      value: 15.95,
      quantity: 200,
      type: 'buy',
      assetCode: 'TEST11',
      createdAt: date,
    });

    expect(positionRepositoryMock.saveUserCurrentPosition.mock.calls[0]).toEqual([{
      quantity: 300,
    }]);

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

  it('Should no register an operation when the transaction failed', async () => {
    mockUnitOfWork.runTransaction = jest.fn().mockRejectedValueOnce(new Error('Database error'));
    positionRepositoryMock.getUserCurrentPosition.mockResolvedValueOnce({
      quantity: 100,
    });

    try {
      await submitOperationService.submit({
        userId: user.id,
        value: 15.95,
        quantity: 200,
        type: 'buy',
        assetCode: 'TEST11',
        createdAt: date,
      });
    } catch (error) {
      expect(error.message).toEqual('Database error');
    }
  });

  it('Should throw an error when the asset not found', async () => {
    let error: Error;

    try {
      await submitOperationService.submit({
        userId: user.id,
        value: 15.95,
        quantity: 200,
        type: 'buy',
        assetCode: 'TEST3',
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
