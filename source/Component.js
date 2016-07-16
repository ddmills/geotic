'use strict';

export default class Component
{
  constructor(name)
  {
    this.name = name;
  }

  serialize()
  {
    let props = Object.getOwnPropertyNames(this);

    let serializedComponent = {};

    for (let prop of props) {
      if (prop == 'entity') continue;
      serializedComponent[prop] = this[prop];
    }

    return serializedComponent;
  }

  destroy()
  {
  }
}
