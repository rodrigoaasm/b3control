import {
  NotFoundError,
  BadRequestError,
  EntityError,
} from '@domain-error/custom-error';

describe('Custom Error', () => {
  it('Should return the error with its respective status ', () => {
    const tests = [
      {
        error: NotFoundError,
        expect: 'NOT_FOUND_ERROR',
      },
      {
        error: BadRequestError,
        expect: 'BAD_REQUEST_ERROR',
      },
      {
        error: EntityError,
        expect: 'ENTITY_ERROR',
      },
    ];

    tests.forEach((test) => {
      const error = test.error('error');
      expect(error.status).toEqual(test.expect);
      expect(error.message).toEqual('error');
    });
  });
});
