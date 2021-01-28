import Query from '../Query';

export default class QueryRegistry {
    _ecs;
    _queries = [];

    constructor(ecs) {
        this._ecs = ecs;
    }

    create(filters) {
        const query = new Query(this._ecs, filters);

        this._queries.push(query);

        return query;
    }

    onComponentAdded(entity) {
        this._queries.forEach((query) => query._onComponentAdded(entity));
    }

    onComponentRemoved(entity) {
        this._queries.forEach((query) => query._onComponentRemoved(entity));
    }

    onEntityCreated(entity) {
        this._queries.forEach((query) => query._onEntityCreated(entity));
    }

    onEntityDestroyed(entity) {
        this._queries.forEach((query) => query._onEntityDestroyed(entity));
    }
}
