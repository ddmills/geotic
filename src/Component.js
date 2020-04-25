import EntityRefProperty from './Properties/EntityRefProperty';
import SimpleProperty from './Properties/SimpleProperty';
import AccessorProperty from './Properties/AccessorProperty';

export default class Component {
    #entity = null;
    #ecs = null;
    #props = {};

    static allowMultiple = false;
    static accessorProperty = null;
    static properties = {};

    static get type() {
        return this.name;
    }

    get entity() {
        return this.#entity;
    }

    get ecs() {
        return this.ecs;
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

    get accessorProperty() {
        return this.constructor.accessorProperty;
    }

    get properties() {
        return this.#props;
    }

    get accessor() {
        return this[this.accessorProperty];
    }

    constructor(ecs, properties = {}) {
        this.#ecs = ecs;
        this._defineProxies(properties);
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
        this.onAttached();
    }

    _onDetached() {
        if (this.isAttached) {
            this.onDetached();
            this.#entity = null;
        }
    }

    onAttached() {}

    onDetached() {}

    remove() {
        if (this.isAttached) {
            this.entity.remove(this);
        }
    }

    _defineProxies(initialProperties) {
        Object.entries(this.constructor.properties).forEach(([key, value]) => {
            if (value === '<Entity>') {
                this.#props[key] = new EntityRefProperty(
                    this.#ecs,
                    initialProperties[key]
                );
            } else if (key === this.accessorProperty) {
                this.#props[key] = new AccessorProperty(initialProperties[key]);
            } else {
                this.#props[key] = new SimpleProperty(initialProperties[key]);
            }

            Object.defineProperty(this, key, {
                enumerable: true,
                set(v) {
                    this.#props[key].value = v;
                },
                get() {
                    return this.#props[key].value;
                },
            });
        });
    }
}
