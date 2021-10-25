import { OperationModel } from './operation-model';
import { AssetModel } from './asset-model';
import { AssetQuoteModel } from './asset-quote-model';

const persistentEntities = [
  OperationModel,
  AssetModel,
  AssetQuoteModel,
];

export {
  OperationModel,
  AssetModel,
  AssetQuoteModel,
};

export default persistentEntities;
