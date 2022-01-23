import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export const ASSET_TABLE_NAME = 'user';

@Entity({ name: ASSET_TABLE_NAME })
export class UserModel {
  @PrimaryGeneratedColumn()
  public id : string;

  @Column()
  public name : string;

  @Column()
  public createdAt : Date;

  @Column()
  public updatedAt : Date;
}

export default UserModel;
