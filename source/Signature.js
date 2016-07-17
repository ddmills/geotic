'use strict';

import Emitter from './Emitter';


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
      this.emit('entity-added', entity);
    }
  }

  removeEntity(entity)
  {
    if (this.hasEntity(entity)) {
      this.entities.delete(entity.id);
      this.emit('entity-removed', entity);
    }
  }

  onComponentRemoved(entity, component)
  {
    if (!this.hasEntity(entity)) {
      return;
    }

    for (let name of this.componentNames) {
      if (component.name === name) {
        this.removeEntity(entity);
      }
    }
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
