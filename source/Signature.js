'use strict';

export default class Signature
{
  constructor(componentNames)
  {
    this.entities = new Map();
    this.componentNames = componentNames;
  }

  hasEntity(entity)
  {
    return this.entities.has(entity.id);
  }

  addEntityIfMatches(entity)
  {
    if (this.matches(entity)) {
      this.entities.set(entity.id, entity);
    }
  }

  removeEntity(entity)
  {
    this.entities.delete(entity.id);
  }

  matches(entity)
  {
    for (let name of this.componentNames) {
      if (!entity.hasComponent(name)) {
        return false;
      }
    }

    return true;
  }
}
