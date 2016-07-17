'use strict';

import Emitter from './Emitter';


export default class Tag extends Emitter
{
  constructor(names)
  {
    super();
    this.entities = new Map();
    this.names = names;
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

  onComponentRemoved(entity)
  {
    if (!this.hasEntity(entity)) {
      return;
    }

    if (!this.matches(entity)) {
      this.removeEntity(entity);
    }
  }

  matches(entity)
  {
    for (let name of this.names) {
      if (!entity.hasTag(name)) {
        return false;
      }
    }

    return true;
  }
}
