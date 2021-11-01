import {
  NotFoundError,
  BadRequestError,
  EntityError,
  ConstructorEntityError,
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
        build: ConstructorEntityError,
        expect: 'CONSTRUCTOR_ENTITY_ERROR',
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
