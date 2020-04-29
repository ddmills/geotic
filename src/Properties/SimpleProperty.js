import Property from './Property';

export default class SimpleProperty extends Property {
    value = null;

    set(value) {
        this.value = value;
    }

    get() {
        return this.value;
    }

    serialize() {
        return this.value;
    }
}
