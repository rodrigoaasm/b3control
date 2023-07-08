/* eslint-disable no-new */
import { AssetEntity } from '@entities/asset/';

describe('Paper Factory', () => {
  it('Should make a stock paper', async () => {
    const paper = new AssetEntity(1, 'TEST11', 'Test', '', 'stock');

    expect(paper).toEqual({
      _category: 'stock',
      _id: 1,
      _code: 'TEST11',
      _social: 'Test',
      _logo: '',
    });
  });

  it('Should make a FII asset', async () => {
    const asset = new AssetEntity(1, 'TEST11', 'Test', '', 'FII');

    expect(asset).toEqual({
      _category: 'FII',
      _id: 1,
      _code: 'TEST11',
      _social: 'Test',
      _logo: '',
    });
  });

  it('Should throw an Error when the _id is undefined.', async () => {
    let error: Error;

    try {
      new AssetEntity(undefined, 'TEST11', 'Test', '', 'stock');
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.name).toBe('Error');
  });

  it('Should throw an Error when the _code is undefined.', async () => {
    let error: Error;

    try {
      new AssetEntity(1, undefined, 'Test', '', 'stock');
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.name).toBe('Error');
  });

  it('Should throw an Error when the _category is invalid.', async () => {
    let error: Error;

    try {
      new AssetEntity(1, 'TEST11', 'Test', '', 'etf' as any);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.name).toBe('Error');
  });
});
