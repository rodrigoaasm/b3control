import { AssetEntity } from '@entities/asset';
import { DividendPaymentEntity } from '@entities/dividend-payment';
import { UserEntity } from '@entities/user';

export interface IDividendPaymentFactory {
  make(
    user: UserEntity,
    value: number,
    asset: AssetEntity,
    createdAt: Date | string,
    id?: number | undefined,
  ): DividendPaymentEntity;
}
