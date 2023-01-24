/* eslint-disable max-classes-per-file */
class QueryBuilderMock {
  public rawManyReturnValue: any;

  constructor() {
    this.rawManyReturnValue = [];
  }

  public setRawManyReturnValue = (returnValue) => {
    this.rawManyReturnValue = returnValue;
  };

  public select = (): QueryBuilderMock => this;

  public from = (): QueryBuilderMock => this;

  public leftJoin = (): QueryBuilderMock => this;

  public where = (): QueryBuilderMock => this;

  public andWhere = (): QueryBuilderMock => this;

  public innerJoin = (): QueryBuilderMock => this;

  public orderBy = (): QueryBuilderMock => this;

  public addGroupBy = (): QueryBuilderMock => this;

  public getQuery = (): string => '';

  public getRawMany = (): any => this.rawManyReturnValue;
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
    createQueryBuilderMock: (): QueryBuilderMock => connectionMock.queryBuilder,
    createQueryRunner: (): QueryRunnerMock => connectionMock.queryRunner,
    getRepository: () => mockParentRepository,
  };
  return connectionMock;
};

export default createConnectionMock;
