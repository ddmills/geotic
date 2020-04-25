import Entity from './Entity';

export default class EntityRegistry {
    #entities = {};
    #ecs = null;

    constructor(ecs) {
        this.#ecs = ecs;
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
