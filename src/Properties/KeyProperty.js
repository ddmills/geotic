export default class keyProperty {
    #value = null;

    get value() {
        return this.#value;
    }

    set value(v) {
        if (!this.value) {
            this.#value = v;
            return;
        }

        console.warn(
            'Property is read-only and cannot be changed, since it is marked as a key property.'
        );
    }

    constructor(value) {
        this.#value = value;
    }

    serialize() {
        return this.#value;
    }
}
