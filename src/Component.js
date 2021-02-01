export class Component {
    static allowMultiple = false;
    static keyProperty = null;
    static properties = {};

    get world() {
        return this.entity.world;
    }

    get allowMultiple() {
        return this.constructor.allowMultiple;
    }

    get keyProperty() {
        return this.constructor.keyProperty;
    }

    constructor(properties = {}) {
        Object.assign(this, this.constructor.properties, properties);
    }

    destroy() {
        this.entity.remove(this);
    }

    _onDestroyed() {
        this.onDestroyed();
        delete this.entity;
    }

    _onEvent(evt) {
        this.onEvent(evt);

        if (typeof this[evt.handlerName] === 'function') {
            this[evt.handlerName](evt);
        }
    }

    _onAttached(entity) {
        this.entity = entity;
        this.onAttached(entity);
    }

    serialize() {
        const ob = {};

        for (const key in this.constructor.properties) {
            ob[key] = this[key];
        }

        return ob;
    }

    onAttached(entity) {}
    onDestroyed() {}
    onEvent(evt) {}
}
