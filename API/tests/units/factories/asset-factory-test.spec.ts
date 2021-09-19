import { AssetFactory, AssetCategory } from '@entities/asset/';

describe('Paper Factory', () => {
  it('Should make a stock paper', async () => {
    const paper = AssetFactory.getInstance(1, 'TEST11', 'Test', '', 'stock');

    expect(paper).toEqual({
      category: 'stock',
      id: 1,
      code: 'TEST11',
      social: 'Test',
      logo: '',
    });
  });

  it('Should make a generic asset', async () => {
    const asset = AssetFactory.getInstance(1, 'TEST11', 'Test', '', 'general');

    expect(asset).toEqual({
      category: 'general',
      id: 1,
      code: 'TEST11',
      social: 'Test',
      logo: '',
    });
  });

  it('Should throw an Error when the id is undefined.', async () => {
    let error: Error;

    try {
      AssetFactory.getInstance(undefined, 'TEST11', 'Test', '', 'stock');
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.name).toBe('Error');
  });

  it('Should throw an Error when the code is undefined.', async () => {
    let error: Error;

    try {
      AssetFactory.getInstance(1, undefined, 'Test', '', 'stock');
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.name).toBe('Error');
  });

  it('Should throw an Error when the category is invalid.', async () => {
    let error: Error;

    try {
      AssetFactory.getInstance(1, 'TEST11', 'Test', '', 'etf' as AssetCategory);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.name).toBe('Error');
  });
});
