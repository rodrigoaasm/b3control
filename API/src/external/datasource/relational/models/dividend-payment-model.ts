import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne, JoinColumn,
  Column,
} from 'typeorm';

import { AssetModel } from './asset-model';
import { UserModel } from './user-model';

export const DIVIDEND_PAYMENT_TABLE_NAME = 'dividend_payment';

@Entity({ name: DIVIDEND_PAYMENT_TABLE_NAME })
export class DividendPaymentModel {
  @PrimaryGeneratedColumn()
  public id ?: number;

  @Column()
  public value : number;

  @OneToOne(() => AssetModel)
  @JoinColumn({ name: 'asset_id' })
  public asset : AssetModel;

  @OneToOne(() => UserModel)
  @JoinColumn({ name: 'user_id' })
  public user : UserModel;

  @Column({ name: 'created_at' })
  public createdAt : Date;
}

export default DividendPaymentModel;
