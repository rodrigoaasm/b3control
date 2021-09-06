import { PaperCategory } from './paper-category';

export interface PaperEntity {
  id : number;
  code : string;
  social : string;
  logo : string;
  category : PaperCategory;
}
