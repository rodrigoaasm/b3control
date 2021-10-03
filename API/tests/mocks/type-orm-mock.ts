class QueryBuilder {
  public rawManyReturnValue;

  public setRawManyReturnValue = (returnValue) => {
    this.rawManyReturnValue = returnValue;
  };

  public select = (): QueryBuilder => this;

  public from = (): QueryBuilder => this;

  public where = (): QueryBuilder => this;

  public andWhere = (): QueryBuilder => this;

  public innerJoin = (): QueryBuilder => this;

  public orderBy = (): QueryBuilder => this;

  public getQuery = (): string => '';

  public getRawMany = (): any => this.rawManyReturnValue;
}

export const connectionMock = {
  queryBuilder: new QueryBuilder(),
  createQueryBuilder: (): QueryBuilder => connectionMock.queryBuilder,
};

export default connectionMock;
