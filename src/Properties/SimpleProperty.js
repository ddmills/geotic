export default class SimpleProperty {
    value = null;

    constructor(value) {
        this.value = value;
    }

    serialize() {
        return this.value;
    }
}
