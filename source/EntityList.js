'use strict';

import Entity from './Entity';
import Emitter from './Emitter';


export default class EntityList extends Emitter
{
  constructor()
  {
    super();
    this.entities = new Map();
  }

  has(id)
  {
    return this.entities.has(id);
  }

  get(id)
  {
    return this.entities.get(id);
  }

  all()
  {
    return this.entities;
  }

  add(entity)
  {
    if (!this.has(entity.id)) {
      this.entities.set(entity.id, entity);

      entity.on('component-added', (component) => {
        this.onComponentAdded(entity, component);
      });

      entity.on('component-removed', (component) => {
        this.onComponentRemoved(entity, component);
      });

      this.emit('entity-added', entity);
      return true;
    }

    return false;
  }

  remove(entity)
  {
    if (this.has(entity.id)) {
      this.entities.delete(entity.id);

      this.emit('entity-removed', entity);
      return true;
    }

    return false;
  }

  onComponentAdded(entity, component)
  {
    this.emit('component-added', entity, component);
  }

  onComponentRemoved(entity, component)
  {
    this.emit('component-removed', entity, component);
  }
}
