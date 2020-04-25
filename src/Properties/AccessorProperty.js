export default class AccessorProperty {
    #value = null;

    get value() {
        return this.#value;
    }

    set value(v) {
        if (!this.value) {
            this.#value = v;
            return;
        }

        console.warn('Property cannot be changed, since it is marked as an accessor property.');
    }

    constructor(value) {
        this.#value = value;
    }

    serialize() {
        return this.#value;
    }
}
