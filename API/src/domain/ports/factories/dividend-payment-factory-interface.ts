import { AssetEntity } from '@entities/asset';
import { DividendPaymentEntity } from '@entities/dividend-payment';

export interface IDividendPaymentFactory {
  make(
    value: number,
    asset: AssetEntity,
    createdAt: Date | string,
    id?: number | undefined,
  ): DividendPaymentEntity;
}
