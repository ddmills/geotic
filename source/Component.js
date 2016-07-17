'use strict';

export default class Component
{
  constructor(name)
  {
    this.name = name;
    this.tags = [];
  }

  tag(tag)
  {
    this.tags.push(tag);
  }

  removeTag(tag)
  {
    let index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  hasTag(tag)
  {
    return this.tags.includes(tag);
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
