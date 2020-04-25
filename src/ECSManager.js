import ComponentRegistry from './ComponentRegistry';
import PrefabRegistry from './PrefabRegistry';
import { nanoid } from 'nanoid/non-secure';
import Entity from './Entity';

export default class ECSManager {
    #entities = {};

    constructor() {
        this.idGenerator = () => nanoid();

        this.registry = new ComponentRegistry(this);
        this.prefabs = new PrefabRegistry(this);
    }

    generateId() {
        return this.idGenerator();
    }

    createEntity() {
        const entity = new Entity(this);

        return this.registerEntity(entity);
    }

    createPrefab(nameOrClass) {
        return this.prefabs.create(nameOrClass);
    }

    registerEntity(entity) {
        this.#entities[entity.id] = entity;

        return entity;
    }

    registerPrefab(data) {
        this.prefabs.deserialize(data);
    }

    registerComponent(component) {
        this.registry.register(component);
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
