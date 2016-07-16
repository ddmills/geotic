'use strict';

export default class Component
{
  get name()
  {
    return this.constructor.name;
  }

  destroy()
  {

  }
}
