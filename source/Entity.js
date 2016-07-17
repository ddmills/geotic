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

  hasTag(tag)
  {
    for (let [name, component] of this.components) {
      if (component.hasTag(tag)) {
        return true;
      }
    }

    return false;
  }

  getComponentsWithTag(tag)
  {
    let components = [];
    for (let [name, component] of this.components) {
      if (component.hasTag(tag)) {
        components.push(component);
      }
    }
    return components;
  }

  serialize()
  {
    let serializedComponents = [];

    for (let [name, component] of this.components) {
      serializedComponents[name] = component.serialize();
    }

    return {
      id: this.id,
      components: serializedComponents
    };
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
      component.mount(this);
      this.emit('component-added', component);
      return true;
    }
    return false;
  }

  removeComponent(component)
  {
    if (this.hasComponent(component.name)) {
      component.unmount(this);
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
    this.emit('entity-destroyed');
  }
}
