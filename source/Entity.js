'use strict';

import EventEmitter from 'event-emitter-es6';


export default class Entity extends EventEmitter
{
  constructor(id)
  {
    super();
    this.id = id;
    this.components = [];
  }

  addComponent(component)
  {
    this.components.push(component);
    component.entity = this;
    this.emit('component-added', component);
  }

  hasComponent(name)
  {
    for (let component of this.components) {
      if (component.name == name) {
        return true;
      }
    }

    return false;
  }
}
