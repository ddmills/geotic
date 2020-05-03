import Entity from '../Entity';

export default class EntityRegistry {
    #entities = {};
    #ecs = null;
    #refs = {};

    constructor(ecs) {
        this.#ecs = ecs;
    }

    get all() {
        return Object.values(this.#entities);
    }

    register(entity) {
        this.#entities[entity.id] = entity;

        return entity;
    }

    get(id) {
        return this.#entities[id];
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
        delete this.#entities[entity.id];
        this.#ecs.queries.onEntityDestroyed(entity);
    }

    cleanupRefs(entity) {
        const refs = this.#refs[entity.id];

        if (!refs) {
            return;
        }

        for (const ref of refs) {
            ref.cleanupReference(entity);
        }

        delete this.#refs[entity.id];
    }

    addRef(entityId, property) {
        if (!(entityId in this.#refs)) {
            this.#refs[entityId] = new Set();
        }

        this.#refs[entityId].add(property);
    }

    removeRef(entityId, property) {
        if (entityId in this.#refs) {
            this.#refs[entityId].delete(property);
        }
    }

    serialize() {
        return Object.values(this.#entities).map((entity) =>
            entity.serialize()
        );
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

        Object.entries(componentData).forEach(([type, value]) => {
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
