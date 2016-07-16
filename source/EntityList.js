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

  serialize()
  {
    let serializedEntities = {};

    for (let [id, entity] of this.entities) {
      serializedEntities[id] = entity.serialize();
    }

    return serializedEntities;
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

  remove(id)
  {
    if (this.has(id)) {
      let entity = this.entities.get(id);
      this.entities.delete(id);
      this.emit('entity-removed', entity);
      return true;
    }

    return false;
  }

  destroy(id)
  {
    if (this.has(id)) {
      let entity = this.entities.get(id);
      this.remove(id);
      entity.destroy();
      this.emit('entity-destroyed', entity);
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
