import { PaperCategory } from './paper-category';
import { PaperEntity } from './paper-entity';

export class PaperFactory {
  static getInstance(id : number, code : string, social : string,
    logo : string, category : PaperCategory): PaperEntity {
    if (!id) {
      throw new Error('It was not possible create the stock object!\n Stock id not found.');
    }

    if (!code) {
      throw new Error('It was not possible create the stock object!\n Stock code not found.');
    }

    if (category !== 'stock' && category !== 'paper') {
      throw new Error("It was not possible create the stock object!\n The category is invalid! Expect 'stock' or 'papper'.");
    }
    const paper = {
      id,
      code,
      social,
      logo,
      category,
    };

    return paper;
  }
}

export default PaperFactory;
