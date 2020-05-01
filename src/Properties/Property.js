export default class Property {
    component;

    constructor(component) {
        this.component = component;
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

    get() {
        return undefined;
    }

    set(value) {}

    serialize() {
        return undefined;
    }

    onDestroyed() {}

    cleanupReference(entity) {}
}
