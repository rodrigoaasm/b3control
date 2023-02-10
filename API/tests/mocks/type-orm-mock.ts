/* eslint-disable max-classes-per-file */
class QueryBuilderMock {
  public select = jest.fn().mockReturnValue(this);

  public from = jest.fn().mockReturnValue(this);

  public leftJoin = jest.fn().mockReturnValue(this);

  public where = jest.fn().mockReturnValue(this);

  public andWhere = jest.fn().mockReturnValue(this);

  public innerJoin = jest.fn().mockReturnValue(this);

  public orderBy = jest.fn().mockReturnValue(this);

  public addGroupBy = jest.fn().mockReturnValue(this);

  public getQuery = (): string => '';

  public getRawMany = jest.fn();

  public getRawOne = jest.fn();
}

class QueryRunnerMock {
  public manager: any;

  public startTransaction = () => {
    this.manager = {};
  };

  public commitTransaction = jest.fn();

  public rollbackTransaction = jest.fn();

  public release = jest.fn();
}

const createConnectionMock = (mockParentRepository: any): any => {
  const connectionMock = {
    queryBuilder: new QueryBuilderMock(),
    queryRunner: new QueryRunnerMock(),
    createQueryBuilder: (): QueryBuilderMock => connectionMock.queryBuilder,
    createQueryRunner: (): QueryRunnerMock => connectionMock.queryRunner,
    getRepository: () => mockParentRepository,
    close: jest.fn(),
    manager: {
      transaction: jest.fn().mockImplementation(async (f: Function) => { await f({}); }),
    },
  };
  return connectionMock;
};

export default createConnectionMock;
