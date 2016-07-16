'use strict';

import EventEmitter from 'event-emitter-es6';


export default class Entity extends EventEmitter
{
  constructor(id)
  {
    super();
    this.id = id;
    this.components = new Map();
  }

  addComponent(component)
  {
    if (!this.hasComponent(component.name)) {
      this.components.set(component.name, component);
      component.entity = this;
      this.emitSync('component-added', component);
      return true;
    }
    return false;
  }

  removeComponent(component)
  {
    if (this.hasComponent(component.name)) {
      this.components.delete(component.name);
      this.emitSync('component-removed', component);
      return true;
    }

    return false;
  }

  destroy()
  {
    this.components.forEach((component) => {
      this.removeComponent(component);
      component.destroy();
    });
  }

  hasComponent(name)
  {
    return this.components.has(name);
  }
}
