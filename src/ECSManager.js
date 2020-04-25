import ComponentRegistry from './ComponentRegistry';
import { nanoid } from 'nanoid'
import Entity from './Entity';

export default class ECSManager {
    #entities = {};

    constructor() {
        this.idGenerator = () => nanoid();

        this.registry = new ComponentRegistry(this);
    }

    generateId() {
        return this.idGenerator();
    }

    createEntity() {
        const entity = new Entity(this);

        this.#entities[entity.id] = entity;

        return entity;
    }

    getEntity(id) {
        return this.#entities[id];
    }

    createComponent(type, properties) {
        return this.registry.create(type, properties);
    }
}
