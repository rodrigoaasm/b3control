/* eslint-disable no-underscore-dangle */
import { EntityConstructionError } from '@domain-error/custom-error';
import { AssetCategory } from './asset-category';

export class AssetEntity {
  private _id: number;

  private _code: string;

  private _social: string;

  private _logo: string;

  private _category: AssetCategory;

  constructor(
    id : number,
    code : string,
    social : string,
    logo : string,
    category : AssetCategory,
  ) {
    if (!id) {
      throw EntityConstructionError('It was not possible create the stock object!\n Stock id not found.');
    }

    if (!code) {
      throw EntityConstructionError('It was not possible create the stock object!\n Stock code not found.');
    }

    if (category !== 'stock' && category !== 'general' && category !== 'current') {
      throw EntityConstructionError("It was not possible create the stock object!\n The category is invalid! Expect 'stock' or 'general'.");
    }

    this._id = id;
    this._category = category;
    this._code = code;
    this._logo = logo;
    this._social = social;
  }

  get id() {
    return this._id;
  }

  get code() {
    return this._code;
  }

  get category() {
    return this._category;
  }

  get logo() {
    return this._logo;
  }

  get social() {
    return this._social;
  }
}

export default AssetEntity;
