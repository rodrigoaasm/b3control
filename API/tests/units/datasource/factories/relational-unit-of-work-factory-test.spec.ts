import RelationalUnitOfWorkFactory from '@external/datasource/relational/relational-unit-of-work-factory';
import createConnectionMock from '@test-mocks/type-orm-mock';

const connectionMock = createConnectionMock({});

describe('RelationalUnitOfWorkFactory', () => {
  let relationalUnitOfWorkFactory: RelationalUnitOfWorkFactory;

  beforeAll(() => {
    relationalUnitOfWorkFactory = new RelationalUnitOfWorkFactory(connectionMock);
  });

  it('Should make a correct object', async () => {
    const relationalUnitOfWork = relationalUnitOfWorkFactory.make();

    await relationalUnitOfWork.start();
    expect(connectionMock.queryRunner.manager).toBeDefined();
  });
});
