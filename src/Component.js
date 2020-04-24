export default class Component {
    #entity = null;
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
        return this.entity.ecs;
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

    constructor(properties) {
        this._defineProxies();
        Object.entries(properties).forEach(([key, value]) =>{
            this[key] = value;
        });
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

    onAttached() {
    }

    onDetached() {
    }

    remove() {
        if (this.isAttached) {
            this.entity.remove(this);
        }
    }

    _defineProxies() {
        Object.entries(this.constructor.properties).forEach(([key, value]) => {
            Object.defineProperty(this, key, {
                enumerable: true,
                set(v) {
                    this.#props[key] = v;
                },
                get() {
                    return this.#props[key];
                }
            });
        });
    }
}
