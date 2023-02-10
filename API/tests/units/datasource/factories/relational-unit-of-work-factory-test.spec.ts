import { IOperationFactory } from '@domain-ports/factories/operation-factory-interface';
import { IPositionFactory } from '@domain-ports/factories/position-factory-interface';
import { RelationalUnitOfWorkFactory } from '@external/datasource/relational/relational-unit-of-work-factory';
import createConnectionMock from '@test-mocks/type-orm-mock';

jest.mock('@external/datasource/relational/repositories/operation-repository', () => ({
  OperationRepository: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('@external/datasource/relational/repositories/position-repository', () => ({
  PositionRepository: jest.fn().mockImplementation(() => ({})),
}));

const connectionMock = createConnectionMock({});

describe('RelationalUnitOfWorkFactory', () => {
  let relationalUnitOfWorkFactory: RelationalUnitOfWorkFactory;

  beforeAll(() => {
    relationalUnitOfWorkFactory = new RelationalUnitOfWorkFactory(
      connectionMock, {} as IOperationFactory, {} as IPositionFactory,
    );
  });

  it('Should make a correct object', async () => {
    const relationalUnitOfWork = relationalUnitOfWorkFactory.make();

    expect((await relationalUnitOfWork).getOperationRepository()).toBeDefined();
    expect((await relationalUnitOfWork).getPositionRepository()).toBeDefined();
  });
});
