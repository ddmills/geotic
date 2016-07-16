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

  addEntity(entity)
  {
    this.entities.set(entity.id, entity);
    this.emit('entity-added', entity);
  }
}
