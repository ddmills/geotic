import { Component } from './Component';
import { EntityEvent } from './EntityEvent';

const attachComponent = (entity, component) => {
    const key = component._ckey;

    entity[key] = component;
    entity.components[key] = component;
};

const attachComponentKeyed = (entity, component) => {
    const key = component._ckey;

    if (!entity.components[key]) {
        entity[key] = {};
        entity.components[key] = {};
    }

    entity[key][component[component.keyProperty]] = component;
    entity.components[key][component[component.keyProperty]] = component;
};

const attachComponentArray = (entity, component) => {
    const key = component._ckey;

    if (!entity.components[key]) {
        entity[key] = [];
        entity.components[key] = [];
    }

    entity[key].push(component);
    entity.components[key].push(component);
};

const removeComponent = (entity, component) => {
    const key = component._ckey;

    delete entity[key];
    delete entity.components[key];
    entity._cbits = entity._cbits & ~(1n << component._cbit);
};

const removeComponentKeyed = (entity, component) => {
    const key = component._ckey;
    const keyProp = component[component.keyProperty];

    delete entity[key][keyProp];
    delete entity.components[key][keyProp];

    if (Object.keys(entity[key]).length <= 0) {
        delete entity[key];
        delete entity.components[key];
        entity._cbits = entity._cbits & ~(1n << component._cbit);
    }
};

const removeComponentArray = (entity, component) => {
    const key = component._ckey;
    const idx = entity[key].indexOf(component);

    entity[key].splice(idx, 1);
    entity.components[key].splice(idx, 1);

    if (entity[key].length <= 0) {
        delete entity[key];
        delete entity.components[key];
        entity._cbits = entity._cbits & ~(1n << component._cbit);
    }
};

const serializeComponent = (component) => {
    return component.serialize();
};

const serializeComponentArray = (arr) => {
    return arr.map(serializeComponent);
};

const serializeComponentKeyed = (ob) => {
    const ser = {};

    for (const k in ob) {
        ser[k] = serializeComponent(ob[k]);
    }

    return ser;
};

const ONE = 1n;

export class Entity {
    _cbits = 0n;

    constructor(world, id) {
        this.world = world;
        this.id = id;
        this.components = {};
    }

    add(clazz, properties) {
        const component = new clazz(properties);

        if (component.keyProperty) {
            attachComponentKeyed(this, component);
        } else if (component.allowMultiple) {
            attachComponentArray(this, component);
        } else {
            attachComponent(this, component);
        }

        component._onAttached(this);

        this._cbits = this._cbits | ONE << component._cbit;
    }

    has(clazz) {
        const bit = clazz.prototype._cbit;

        return ((this._cbits >> bit) % 2n !== 0n);
    }

    remove(component) {
        if (component.keyProperty) {
            removeComponentKeyed(this, component);
        } else if (component.allowMultiple) {
            removeComponentArray(this, component);
        } else {
            removeComponent(this, component);
        }

        component._onRemoved();
    }

    destroy() {
        for (const k in this.components) {
            const v = this.components[k];

            if (v instanceof Component) {
                removeComponent(this, v);
                v._onRemoved();
            } else if (v instanceof Array) {
                const len = v.length;

                for (let i = 0; i < len; i++) {
                    const component = v[0];

                    removeComponentArray(this, component);
                    component._onRemoved();
                };
            } else {
                for (const component of Object.values(v)) {
                    removeComponentKeyed(this, component);
                    component._onRemoved();
                }
            }
        }
    }

    serialize() {
        const components = {};

        for (const k in this.components) {
            const v = this.components[k];

            if (v instanceof Component) {
                components[k] = serializeComponent(v);
            } else if (v instanceof Array) {
                components[k] = serializeComponentArray(v);
            } else {
                components[k] = serializeComponentKeyed(v);
            }
        }

        return {
            id: this.id,
            components,
        };
    }

    fireEvent(name, data) {
        const evt = new EntityEvent(name, data);

        for (const key in this.components) {
            const v = this.components[key];

            if (v instanceof Component) {
                v._onEvent(evt);

                if (evt.prevented) {
                    return evt;
                }
            } else if (v instanceof Array) {
                for (let i = 0; i < v.length; i++) {
                    v[i]._onEvent(evt);

                    if (evt.prevented) {
                        return evt;
                    }
                };
            } else {
                for (const component of Object.values(v)) {
                    component._onEvent(evt);

                    if (evt.prevented) {
                        return evt;
                    }
                }
            }
        }

        return evt;
    }
}
