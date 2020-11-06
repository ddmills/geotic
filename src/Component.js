import camelcase from 'camelcase';
import SimpleProperty from './Properties/SimpleProperty';
import PropertyRegistry from './Registries/PropertyRegistry';

export default class Component {
    #entity = null;
    #ecs = null;
    #props = {};
    #isDestroyed = false;

    static allowMultiple = false;
    static keyProperty = null;
    static properties = {};

    static get type() {
        return this.name;
    }

    get entity() {
        return this.#entity;
    }

    get ecs() {
        return this.#ecs;
    }

    get type() {
        return this.constructor.name;
    }

    get isAttached() {
        return Boolean(this.entity);
    }

    get isDestroyed() {
        return this.#isDestroyed;
    }

    get allowMultiple() {
        return this.constructor.allowMultiple;
    }

    get keyProperty() {
        return this.constructor.keyProperty;
    }

    get properties() {
        const ob = {};

        for (const [key, value] of Object.entries(this.#props)) {
            ob[key] = value.get();
        }

        return ob;
    }

    get key() {
        return this[this.keyProperty];
    }

    constructor(ecs, properties = {}) {
        this.#ecs = ecs;
        this._definePropertyProxies(properties);
    }

    serialize() {
        return Object.entries(this.#props).reduce(
            (o, [key, value]) => ({
                ...o,
                [key]: value.serialize(),
            }),
            {}
        );
    }

    _onAttached(entity) {
        this.#entity = entity;
        this.ecs.queries.onComponentAdded(entity, this);
        this.onAttached();
    }

    _onDetached() {
        if (this.isAttached) {
            this.onDetached();
            const entity = this.#entity;

            this.#entity = null;
            this.ecs.queries.onComponentRemoved(entity, this);
        }
    }

    _onDestroyed() {
        this.#isDestroyed = true;
        this.onDestroyed();

        for (const prop of Object.values(this.#props)) {
            prop.onDestroyed();
        }
    }

    onAttached() {}

    onDetached() {}

    onDestroyed() {}

    remove(destroy = true) {
        if (this.isAttached) {
            this.entity.remove(this);
        }
        if (destroy) {
            this._onDestroyed();
        }
    }

    destroy() {
        this.remove(true);
    }

    clone() {
        return this.ecs.createComponent(this.type, this.serialize());
    }

    _onEvent(evt) {
        this.onEvent(evt);

        const handlerName = camelcase(`on ${evt.name}`);

        if (typeof this[handlerName] === 'function') {
            this[handlerName](evt);
        }
    }

    onEvent(evt) {}

    _definePropertyProxies(initialPropertyValues) {
        for (const key in this.constructor.properties) {
            const baseValue = this.constructor.properties[key];
            const propertyType = this.#ecs.properties.getByBaseValue(baseValue);

            const property = new propertyType(this);

            this.#props[key] = property;

            Object.defineProperty(this, key, property.descriptor);

            if (initialPropertyValues.hasOwnProperty(key)) {
                property.set(initialPropertyValues[key]);
            }
        }
    }
}
