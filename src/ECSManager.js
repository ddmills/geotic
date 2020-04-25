import ComponentRegistry from './ComponentRegistry';
import { nanoid } from 'nanoid';
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

        return this.registerEntity(entity);
    }

    registerEntity(entity) {
        this.#entities[entity.id] = entity;

        return entity;
    }

    getEntity(id) {
        return this.#entities[id];
    }

    createComponent(type, properties) {
        return this.registry.create(type, properties);
    }

    serialize() {
        return {
            entities: Object.values(this.#entities).map((entity) =>
                entity.serialize()
            ),
        };
    }

    deserialize(data) {
        if (data.id) {
            return this.deserializeEntity(data);
        }

        return data.entities.map((entityData) =>
            this.deserializeEntity(entityData)
        );
    }

    deserializeEntity(data) {
        const { id, ...componentData } = data;
        const entity = new Entity(this, id);

        this.registerEntity(entity);

        Object.entries(componentData).forEach(([type, value]) => {
            const definition = this.registry.get(type);

            if (definition.allowMultiple) {
                Object.values(value).forEach((d) => {
                    const component = this.registry.create(definition, d);

                    entity.add(component);
                });
            } else {
                const component = this.registry.create(definition, value);

                entity.add(component);
            }
        });
    }
}
