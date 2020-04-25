import Entity from '../Entity';
import EntityRefProperty from './EntityRefProperty';

export default class EntityRefArrayProperty {
    #ecs;
    #refs = [];

    set value(values) {
        this.#refs = values.map((value) => new EntityRefProperty(value));
    }

    get value() {
        return this.#refs.map((ref) => ref.value);
    }

    constructor(ecs, value) {
        // TODO: convert array to proxy or extend set(?)
        this.#ecs = ecs;
        this.value = value;
    }

    serialize() {
        return this.#refs.map((ref) => ref.serialize());
    }
}
