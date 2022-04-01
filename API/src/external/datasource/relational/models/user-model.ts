import { Entity, PrimaryColumn, Column } from 'typeorm';

export const USER_TABLE_NAME = 'user';

@Entity({ name: USER_TABLE_NAME })
export class UserModel {
  @PrimaryColumn()
  public id : string;

  @Column()
  public name : string;

  @Column({ select: false })
  public password?: string;

  @Column({ name: 'created_at' })
  public createdAt : Date;

  @Column({ name: 'updated_at' })
  public updatedAt : Date;
}

export default UserModel;
