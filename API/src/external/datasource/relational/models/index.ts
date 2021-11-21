import { OperationModel } from './operation-model';
import { AssetModel } from './asset-model';
import { AssetQuoteModel } from './asset-quote-model';
import { DividendPaymentModel } from './dividend-payment-model';

const persistentEntities = [
  OperationModel,
  AssetModel,
  AssetQuoteModel,
  DividendPaymentModel,
];

export {
  OperationModel,
  AssetModel,
  AssetQuoteModel,
  DividendPaymentModel,
};

export default persistentEntities;
