import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne, JoinColumn,
  Column,
} from 'typeorm';
import { UserModel } from './user-model';
import { AssetModel } from './asset-model';

export const OPERATION_TABLE_NAME = 'operation';

@Entity({ name: OPERATION_TABLE_NAME })
export class OperationModel {
  @PrimaryGeneratedColumn()
  public id ?: number;

  @Column()
  public value : number;

  @Column()
  public quantity : number;

  @Column()
  public type : 'buy' | 'sale';

  @OneToOne(() => AssetModel)
  @JoinColumn({ name: 'asset_id' })
  public asset : AssetModel;

  @OneToOne(() => UserModel)
  @JoinColumn({ name: 'user_id' })
  public user : UserModel;

  @Column({ name: 'created_at' })
  public createdAt : Date;
}

export default OperationModel;
