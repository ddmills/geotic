import { Entity } from './Entity';
import { Query } from './Query';

export class World {
    _id = 0;
    _queries = [];
    _entities = new Map();

    constructor(engine) {
        this.engine = engine;
    }

    createId() {
        return ++this._id;
    }

    getEntity(id) {
        return this._entities.get(id);
    }

    createEntity(id = this.createId()) {
        const entity = new Entity(this, id);

        this._entities.set(id, entity);

        return entity;
    }

    createQuery(filters) {
        const query = new Query(this, filters);

        this._queries.push(query);

        return query;
    }

    serialize(entities) {
        const json = [];
        const list = entities || this._entities;

        list.forEach((e) => {
            json.push(e.serialize());
        });

        return {
            entities: json
        };
    }

    _candidate(entity) {
        this._queries.forEach((q) => q.candidate(entity));
    }
}
