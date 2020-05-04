import Entity from '../Entity';
import camelcase from 'camelcase';

export default class EntityRegistry {
    #entities = new Map();
    #ecs = null;
    #refs = new Map();

    constructor(ecs) {
        this.#ecs = ecs;
    }

    get all() {
        return this.#entities.values();
    }

    register(entity) {
        this.#entities.set(entity.id, entity);

        return entity;
    }

    get(id) {
        return this.#entities.get(id);
    }

    createOrGetById(id) {
        const entity = this.get(id);

        if (entity) {
            return entity;
        }

        return this.create(id);
    }

    create(id = undefined) {
        const entity = new Entity(this.#ecs, id);

        this.register(entity);

        this.#ecs.queries.onEntityCreated(entity);

        return entity;
    }

    destroy(entity) {
        entity.destroy();
    }

    onEntityDestroyed(entity) {
        this.cleanupRefs(entity);
        this.#entities.delete(entity.id);
        this.#ecs.queries.onEntityDestroyed(entity);
    }

    cleanupRefs(entity) {
        const refs = this.#refs.get(entity.id);

        if (!refs) {
            return;
        }

        for (const ref of refs) {
            ref.cleanupReference(entity);
        }

        delete this.#refs[entity.id];
    }

    addRef(entityId, property) {
        if (!this.#refs.has(entityId)) {
            this.#refs.set(entityId, new Set([property]));
            return;
        }

        this.#refs.get(entityId).add(property);
    }

    removeRef(entityId, property) {
        if (this.#refs.has(entityId)) {
            this.#refs.get(entityId).delete(property);
        }
    }

    serialize() {
        const json = [];

        this.#entities.forEach((entity) => {
            json.push(entity.serialize());
        });

        return json;
    }

    deserialize(data) {
        for (const entityData of data.entities) {
            this.createOrGetById(entityData.id);
        }

        for (const entityData of data.entities) {
            this.deserializeEntity(entityData);
        }
    }

    deserializeEntity(data) {
        const { id, ...componentData } = data;
        const entity = this.createOrGetById(id);

        Object.entries(componentData).forEach(([key, value]) => {
            const type = camelcase(key, { pascalCase: true });
            const definition = this.#ecs.components.get(type);

            if (definition.allowMultiple) {
                Object.values(value).forEach((d) => {
                    entity.add(definition, d);
                });
            } else {
                entity.add(definition, value);
            }
        });
    }
}
