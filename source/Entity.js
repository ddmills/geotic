'use strict';

import Emitter from './Emitter';


export default class Entity extends Emitter
{
  constructor(id)
  {
    super();
    this.id = id;
    this.components = new Map();
  }

  hasComponent(name)
  {
    return this.components.has(name);
  }

  addComponent(component)
  {
    if (!this.hasComponent(component.name)) {
      this.components.set(component.name, component);
      this[component.name] = component;

      component.entity = this;
      this.emit('component-added', component);
      return true;
    }
    return false;
  }

  removeComponent(component)
  {
    if (this.hasComponent(component.name)) {
      this[component.name] = undefined;
      this.components.delete(component.name);
      this.emit('component-removed', component);
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
}
