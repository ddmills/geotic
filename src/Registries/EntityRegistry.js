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

    create() {
        const entity = new Entity(this.#ecs);

        return this.register(entity);
    }

    destroy(entity) {
        this.cleanupRefs(entity);
        delete this.#entities[entity.id];
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

    addRef(entityId, property) { // TODO include some metadata (index?)
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
        const { id, ...componentData } = data;
        const entity = new Entity(this.#ecs, id);

        this.register(entity);

        Object.entries(componentData).forEach(([type, value]) => {
            const definition = this.#ecs.components.get(type);

            if (definition.allowMultiple) {
                Object.values(value).forEach((d) => {
                    const component = this.#ecs.components.create(
                        definition,
                        d
                    );

                    entity.add(component);
                });
            } else {
                const component = this.#ecs.components.create(
                    definition,
                    value
                );

                entity.add(component);
            }
        });
    }
}
