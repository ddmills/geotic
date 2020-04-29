import Property from './Property';

export default class EntityArrayProperty extends Property {
    refs = [];

    set(values) {
        this.refs = values;
    }

    get() {
        return this.refs;
    }

    serialize() {
        return this.refs.map((ref) => ref.id);
    }
}
