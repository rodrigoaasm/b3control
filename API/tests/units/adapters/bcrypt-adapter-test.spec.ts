/* eslint-disable import/first */
const bcrypt = jest.requireActual('bcrypt');
const mockBcrypt = {
  hash: jest.fn().mockImplementation(bcrypt.hash),
  compare: bcrypt.compare,
};
jest.mock('bcrypt', () => mockBcrypt);

import { ICryptHandlerAdapter } from '@domain-ports/adapters/crypt-handler-adapter-interface';
import CryptAdapter from '@external/adapters/bcrypt-adapter';

describe('CryptAdapter', () => {
  let cryptAdapter: ICryptHandlerAdapter;

  beforeEach(() => {
    cryptAdapter = new CryptAdapter();
  });

  it('Should generate hash for password successfully', async () => {
    const hash = await cryptAdapter.generateHash('Test123*');

    expect(hash.length).toBeGreaterThan(16);
  });

  it('Should throw an error when an error happens', async () => {
    expect.assertions(1);
    mockBcrypt.hash.mockImplementationOnce(() => { throw new Error('Error'); });

    try {
      await cryptAdapter.generateHash('Test123*');
    } catch (cryptError) {
      expect(cryptAdapter).toBeDefined();
    }
  });

  it('Should return true when comparing password hashes', async () => {
    const data = 'Test123*';
    const hashCurrent = await cryptAdapter.generateHash('Test123*');

    const result = await cryptAdapter.compare(data, hashCurrent);

    expect(result).toBeTruthy();
  });

  it('Should return false when comparing password hashes', async () => {
    const data = 'Test123';
    const hashCurrent = await cryptAdapter.generateHash('Test123*');

    const result = await cryptAdapter.compare(data, hashCurrent);

    expect(result).toBeFalsy();
  });
});
