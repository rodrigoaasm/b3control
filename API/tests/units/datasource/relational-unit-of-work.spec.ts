import { RelationalUnitOfWork } from '@external/datasource/relational/relational-unit-of-work';
import createConnectionMock from '@test-mocks/type-orm-mock';

const connectionMock = createConnectionMock({});

describe('RelationalUnitOfWork', () => {
  let relationalUnitOfWork: RelationalUnitOfWork;

  beforeAll(() => {
    relationalUnitOfWork = new RelationalUnitOfWork(connectionMock);
  });

  it('Should throw an error when the transaction has not started', async () => {
    expect(4);
    try {
      await relationalUnitOfWork.complete(() => {});
    } catch (error) {
      expect(error.message).toEqual('Transaction not found');
      expect(connectionMock.queryRunner.commitTransaction).not.toBeCalled();
      expect(connectionMock.queryRunner.rollbackTransaction).not.toBeCalled();
      expect(connectionMock.queryRunner.release).not.toBeCalled();
    }
  });

  it('Should start the transaction', async () => {
    await relationalUnitOfWork.start();

    expect(connectionMock.queryRunner.manager).toBeDefined();
  });

  it('Should complete transaction', async () => {
    const work = jest.fn();
    await relationalUnitOfWork.complete(work);

    expect(work).toBeCalled();
    expect(connectionMock.queryRunner.commitTransaction).toBeCalled();
    expect(connectionMock.queryRunner.rollbackTransaction).not.toBeCalled();
    expect(connectionMock.queryRunner.release).toBeCalled();
  });

  it('Should throw an error when the transaction failed', async () => {
    expect(4);
    const work = jest.fn().mockRejectedValueOnce('transaction error');

    try {
      await relationalUnitOfWork.complete(work);
    } catch (error) {
      expect(error.message).toEqual('There is an error in transaction');
      expect(connectionMock.queryRunner.commitTransaction).not.toBeCalled();
      expect(connectionMock.queryRunner.rollbackTransaction).toBeCalled();
      expect(connectionMock.queryRunner.release).toBeCalled();
    }
  });
});
