export default class Property {
    component;

    constructor(component) {
        this.component = component;
    }

    serialize(value) {
        return value;
    }

    deserialize(value) {
        this.set(value)
    }

    static tag = this.name;

    get tag() {
        return this.constructor.tag;
    }

    serialize() {
        return this.constructor.serialize(this);
    }

    get ecs() {
        return this.component.ecs;
    }

    get descriptor() {
        return {
            enumerable: true,
            get: () => this.get(),
            set: (v) => this.set(v),
        };
    }

    get() {}

    set(value) {}

    onDestroyed() {}

    cleanupReference(entity) {}
}
