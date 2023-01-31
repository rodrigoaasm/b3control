import {
  Entity, PrimaryColumn, Column, OneToOne, JoinColumn,
} from 'typeorm';
import { AssetModel } from './asset-model';
import { UserModel } from './user-model';

export const USER_CURRENT_POSITION_TABLE_NAME = 'user_current_position';

@Entity({ name: USER_CURRENT_POSITION_TABLE_NAME })
export class UserCurrentPositionModel {
  @PrimaryColumn()
  public id : number;

  @OneToOne(() => AssetModel)
  @JoinColumn({ name: 'asset_id' })
  public asset : AssetModel;

  @OneToOne(() => UserModel)
  @JoinColumn({ name: 'user_id' })
  public user : UserModel;

  @Column()
  public quantity: number;

  @Column({ name: 'created_at' })
  public createdAt : Date;

  @Column({ name: 'updated_at' })
  public updatedAt : Date;
}

export default UserCurrentPositionModel;
