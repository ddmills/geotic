import camelcase from 'camelcase';
import PropertyStrategy from './Properties/PropertyStrategy';

export default class Component {
    #entity = null;
    #ecs = null;
    #props = {};

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
        this._defineProxies(properties);
    }

    getDefaultPropertyValue(propertyName) {
        const value = this.constructor.properties[propertyName];

        if (['<Entity>', '<EntityArray>'].includes(value)) {
            return undefined;
        }

        return value;
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

    onAttached() {}

    onDetached() {}

    remove() {
        if (this.isAttached) {
            this.entity.remove(this);
        }
    }

    _onEvent(evt) {
        this.onEvent(evt);

        const handlerName = camelcase(`on ${evt.name}`);

        if (typeof this[handlerName] === 'function') {
            this[handlerName](evt);
        }
    }

    onEvent(evt) {}

    _defineProxies(initialProperties) {
        for (const key in this.constructor.properties) {
            const defaultValue = this.constructor.properties[key];
            const initialValue = initialProperties.hasOwnProperty(key)
                ? initialProperties[key]
                : defaultValue;
            const Property = PropertyStrategy.get(defaultValue);
            const property = new Property(this, initialValue);

            this.#props[key] = property;
            Object.defineProperty(this, key, property.descriptor);
        }
    }
}
