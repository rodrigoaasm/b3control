import { OperationModel } from './operation-model';
import { AssetModel } from './asset-model';
import { AssetQuoteModel } from './asset-quote-model';
import { DividendPaymentModel } from './dividend-payment-model';
import { UserModel } from './user-model';

const persistentEntities = [
  OperationModel,
  AssetModel,
  AssetQuoteModel,
  DividendPaymentModel,
  UserModel,
];

export {
  OperationModel,
  AssetModel,
  AssetQuoteModel,
  DividendPaymentModel,
  UserModel,
};

export default persistentEntities;
