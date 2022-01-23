/* eslint-disable no-underscore-dangle */
import { EntityConstructionError, EntityError } from '@domain-error/custom-error';

export class UserEntity {
  private _id: string;

  private _name: string;

  private _createdAt: Date;

  private _updatedAt: Date;

  constructor(id: string, name: string, createdAt: Date, updated_at: Date) {
    try {
      this.id = id;
      this.name = name;
      this.createdAt = createdAt;
      this.updatedAt = updated_at;
    } catch (error) {
      throw EntityConstructionError(error.message);
    }
  }

  get id(): string {
    return this._id;
  }

  set id(id: string) {
    if (!id) {
      throw EntityError('It was not possible create the user object!\n The user id is undefined.');
    }

    this._id = id;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    if (!name) {
      throw EntityError('It was not possible create the user object!\n The username is undefined.');
    }

    this._name = name;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  set createdAt(createdAt: Date) {
    this._createdAt = createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  set updatedAt(updatedAt: Date) {
    this._updatedAt = updatedAt;
  }
}

export default UserEntity;
