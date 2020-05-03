import Query from '../Query';

export default class QueryRegistry {
    #ecs;
    #queries = [];

    constructor(ecs) {
        this.#ecs = ecs;
    }

    create(filters) {
        const query = new Query(this.#ecs, filters);

        this.#queries.push(query);

        return query;
    }

    onComponentAdded(entity) {
        this.#queries.forEach((query) => query._onComponentAdded(entity));
    }

    onComponentRemoved(entity) {
        this.#queries.forEach((query) => query._onComponentRemoved(entity));
    }

    onEntityCreated(entity) {
        this.#queries.forEach((query) => query._onEntityCreated(entity));
    }

    onEntityDestroyed(entity) {
        this.#queries.forEach((query) => query._onEntityDestroyed(entity));
    }
}
