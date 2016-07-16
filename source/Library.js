'use strict';

export default class Library
{
  constructor()
  {
    this.assets = {};
  }

  get(key)
  {
    return this.assets[key];
  }

  register(value)
  {
    this.assets[value.name] = value;
    return this;
  }
}
