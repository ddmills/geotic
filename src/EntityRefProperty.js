import Entity from './Entity';

export default class EntityRef {
    #ecs;
    #id;

    set value(value) {
        if (value instanceof Entity) {
            this.#id = value.id;
            return;
        }

        if (typeof value === 'string') {
            this.#id = value;
            return;
        }

        this.#id = null;
    }

    get value() {
        return this.#ecs.getEntity(this.#id);
    }

    constructor(ecs) {
        this.#ecs = ecs;
    }

    serialize() {
        return this.#id;
    }
}
