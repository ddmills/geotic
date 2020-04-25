import Query from '../Query';

export default class QueryRegistry {
    #ecs;
    #queries = [];

    constructor(ecs) {
        this.#ecs = ecs;
    }

    exec(filter) {
        const all = this.#ecs.entities.all;

        return all.filter((e) => filter(e));
    }

    create(filter) {
        const query = new Query(this.#ecs, filter);

        this.#queries.push(query);

        return query;
    }

    onComponentAdded(entity, component) {
        this.#queries.forEach((query) => query.candidate(entity));
    }

    onComponentRemoved(entity, component) {
        this.#queries.forEach((query) => query.candidate(entity));
    }
}
