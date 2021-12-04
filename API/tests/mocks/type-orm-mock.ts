class QueryBuilder {
  public rawManyReturnValue;

  constructor() {
    this.rawManyReturnValue = [];
  }

  public setRawManyReturnValue = (returnValue) => {
    this.rawManyReturnValue = returnValue;
  };

  public select = (): QueryBuilder => this;

  public from = (): QueryBuilder => this;

  public leftJoin = (): QueryBuilder => this;

  public where = (): QueryBuilder => this;

  public andWhere = (): QueryBuilder => this;

  public innerJoin = (): QueryBuilder => this;

  public orderBy = (): QueryBuilder => this;

  public addGroupBy = (): QueryBuilder => this;

  public getQuery = (): string => '';

  public getRawMany = (): any => this.rawManyReturnValue;
}

const createConnectionMock = (mockParentRepository: any): any => {
  const connectionMock = {
    queryBuilder: new QueryBuilder(),
    createQueryBuilder: (): QueryBuilder => connectionMock.queryBuilder,
    getRepository: () => mockParentRepository,
  };
  return connectionMock;
};

export default createConnectionMock;
