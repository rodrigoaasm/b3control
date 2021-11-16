import {
  NotFoundError,
  BadRequestError,
  EntityError,
  EntityConstructionError,
} from '@domain-error/custom-error';

describe('Custom Error', () => {
  it('Should return the error with its respective status ', () => {
    const tests = [
      {
        build: NotFoundError,
        expect: 'NOT_FOUND_ERROR',
      },
      {
        build: BadRequestError,
        expect: 'BAD_REQUEST_ERROR',
      },
      {
        build: EntityConstructionError,
        expect: 'ENTITY_CONSTRUCTION_ERROR',
      },
      {
        build: EntityError,
        expect: 'ENTITY_ERROR',
      },
    ];

    tests.forEach((ErrorType) => {
      const error = ErrorType.build('error');
      expect(error.status).toEqual(ErrorType.expect);
      expect(error.message).toEqual('error');
    });
  });
});
