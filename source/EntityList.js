'use strict';

import Entity from './Entity';
import EventEmitter from 'event-emitter-es6';


export default class EntityList extends EventEmitter
{
  constructor()
  {
    super();
    this.entities = new Map();
  }

  has(id)
  {
    return this.entities.has(entity.id);
  }

  get(id)
  {
    return this.entities.set(entity.id, entity);
  }

  add(entity)
  {
    this.entities.set(entity.id, entity);
    this.emit('entity-added', entity);
  }

  remove(entity)
  {
    this.entities.delete(entity.id);
    this.emit('entity-removed', entity);
  }
}
