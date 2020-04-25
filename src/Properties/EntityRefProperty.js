import Entity from '../Entity';

export default class EntityRefProperty {
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

    constructor(ecs, value) {
        this.#ecs = ecs;
        this.value = value;
    }

    serialize() {
        return this.#id;
    }
}
