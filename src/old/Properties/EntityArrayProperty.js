import Property from './Property';

export default class EntityArrayProperty extends Property {
    proxy = [];

    constructor(component) {
        super(component);
        this.proxy = new Proxy([], {
            get: (target, prop, receiver) => {
                return Reflect.get(target, prop, receiver);
            },
            set: (target, prop, value, receiver) => {
                if (isNaN(prop)) {
                    return Reflect.set(target, prop, value, receiver);
                }

                const old = Reflect.get(target, prop, receiver);

                if (typeof value === 'string') {
                    value = this.ecs.entities.get(value);
                }

                if (old && old != value) {
                    this.ecs.entities.removeRef(value, this);
                }

                if (value && value.id) {
                    this.ecs.entities.addRef(value.id, this);

                    return Reflect.set(target, prop, value, receiver);
                }

                return Reflect.set(target, prop, value, receiver);
            },
            deleteProperty: (target, prop) => {
                if (isNaN(prop)) {
                    return Reflect.deleteProperty(target, prop);
                }

                const value = Reflect.get(target, prop);
                this.ecs.entities.removeRef(value, this);

                return Reflect.deleteProperty(target, prop);
            },
        });
    }

    set(values = []) {
        const len = Math.max(values.length, this.proxy.length);

        for (let i = 0; i < len; i++) {
            if (i in values) {
                this.proxy[i] = values[i];
            } else {
                delete this.proxy[i];
            }
        }

        this.proxy.length = values.length;
    }

    get() {
        return this.proxy;
    }

    serialize() {
        return this.proxy.map((ref) => ref.id);
    }

    onDestroyed() {
        this.set([]);
    }

    cleanupReference(entity) {
        this.set(this.proxy.filter((ref) => ref.id !== entity.id));
    }
}
