import {
  Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn,
} from 'typeorm';

import { AssetModel } from './asset-model';

export const ASSET_QUOTE_TABLE_NAME = 'asset_quote';

@Entity({ name: ASSET_QUOTE_TABLE_NAME })
export class AssetQuoteModel {
  @PrimaryGeneratedColumn()
  public id : number;

  @Column({ name: 'price' })
  public price : Number;

  @Column({ name: 'date' })
  public date : Date;

  @OneToOne(() => AssetModel)
  @JoinColumn()
  public stock : AssetModel;
}

export default AssetQuoteModel;
