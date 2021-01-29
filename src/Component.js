export class Component {
    static allowMultiple = false;
    static keyProperty = null;
    static properties = {};

    get allowMultiple() {
        return this.constructor.allowMultiple;
    }

    get keyProperty() {
        return this.constructor.keyProperty;
    }

    constructor(properties = {}) {
        Object.assign(this, properties);
    }

    remove() {
        this.entity.remove(this);
    }

    _onRemoved() {
        this.onRemoved();
        this.entity.world._candidate(this.entity);
    }

    _onEvent(evt) {
        this.onEvent(evt);

        if (typeof this[evt.handlerName] === 'function') {
            this[evt.handlerName](evt);
        }
    }

    _onAttached(entity) {
        this.entity = entity;
        this.entity.world._candidate(this.entity);
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
    onRemoved() {}
    onEvent(evt) {}
}
