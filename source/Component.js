'use strict';

export default class Component
{
  constructor()
  {
  }

  get name()
  {
    return this.constructor.name;
  }
}
