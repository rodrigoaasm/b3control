import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export const ASSET_TABLE_NAME = 'asset';

@Entity({ name: ASSET_TABLE_NAME })
export class AssetModel {
  @PrimaryGeneratedColumn()
  public id : number;

  @Column()
  public code : string;

  @Column()
  public social : string;

  @Column()
  public logo : string;

  @Column()
  public category: string;
}

export default AssetModel;
