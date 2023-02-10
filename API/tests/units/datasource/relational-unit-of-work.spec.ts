/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IPositionRepository } from '@domain-ports/repositories/position-repository-interface';
import { RelationalUnitOfWork } from '@external/datasource/relational/relational-unit-of-work';
import createConnectionMock from '@test-mocks/type-orm-mock';
import OperationRepositoryMock from '@test-mocks/operation-repository-mock';
import { ITypeORMRepository } from '@external/datasource/relational/repositories/typeorm-repositories-interface';

const connectionMock = createConnectionMock({});

const positionRepositoryMock: IPositionRepository & ITypeORMRepository = {
  getAssetTimeseries: jest.fn(),
  setTransactionManager: jest.fn(),
  getUserCurrentPositions: jest.fn(),
  getUserCurrentPosition: jest.fn(),
  saveUserCurrentPosition: jest.fn(),
};

describe('RelationalUnitOfWork', () => {
  let relationalUnitOfWork: RelationalUnitOfWork;
  let operationRepositoryMock: OperationRepositoryMock;

  beforeAll(() => {
    operationRepositoryMock = new OperationRepositoryMock();
    relationalUnitOfWork = new RelationalUnitOfWork(
      connectionMock,
      operationRepositoryMock,
      positionRepositoryMock,
    );
  });

  it('Should return position repository', async () => {
    expect(positionRepositoryMock).toBe(relationalUnitOfWork.getPositionRepository());
  });

  it('Should return operation repository', async () => {
    expect(operationRepositoryMock).toBe(relationalUnitOfWork.getOperationRepository());
  });

  it('Should complete transaction and change repositories transaction manager', async () => {
    const work = jest.fn();
    await relationalUnitOfWork.runTransaction(work);

    expect(work).toBeCalled();
    expect(connectionMock.manager.transaction).toBeCalled();
    expect(operationRepositoryMock.setTransactionManager).toBeCalledTimes(2);
    expect(positionRepositoryMock.setTransactionManager).toBeCalledTimes(2);
  });

  it('Should throw an error when the transaction failed', async () => {
    expect(3);
    const work = jest.fn().mockRejectedValueOnce('transaction error');

    try {
      await relationalUnitOfWork.runTransaction(work);
    } catch (error) {
      expect(error.message).toEqual('There is an error in transaction');
      expect(operationRepositoryMock.setTransactionManager).toBeCalledTimes(2);
      expect(positionRepositoryMock.setTransactionManager).toBeCalledTimes(2);
    }
  });
});
