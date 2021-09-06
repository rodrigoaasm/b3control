import { PaperFactory } from '@entities/paper/paper-factory';
import { PaperCategory } from '@entities/paper/paper-category';

describe('Paper Factory', () => {
  it('Should make a stock paper', async () => {
    const paper = PaperFactory.getInstance(1, 'TEST11', 'Test', '', 'stock');

    expect(paper).toEqual({
      category: 'stock',
      id: 1,
      code: 'TEST11',
      social: 'Test',
      logo: '',
    });
  });

  it('Should make a generic paper', async () => {
    const paper = PaperFactory.getInstance(1, 'TEST11', 'Test', '', 'paper');

    expect(paper).toEqual({
      category: 'paper',
      id: 1,
      code: 'TEST11',
      social: 'Test',
      logo: '',
    });
  });

  it('Should throw an Error when the id is undefined.', async () => {
    let error: Error;

    try {
      PaperFactory.getInstance(undefined, 'TEST11', 'Test', '', 'stock');
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.name).toBe('Error');
  });

  it('Should throw an Error when the code is undefined.', async () => {
    let error: Error;

    try {
      PaperFactory.getInstance(1, undefined, 'Test', '', 'stock');
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.name).toBe('Error');
  });

  it('Should throw an Error when the category is invalid.', async () => {
    let error: Error;

    try {
      PaperFactory.getInstance(1, 'TEST11', 'Test', '', 'etf' as PaperCategory);
    } catch (submitedError) {
      error = submitedError;
    }

    expect(error.name).toBe('Error');
  });
});
