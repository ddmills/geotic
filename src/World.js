import { Entity } from './Entity';
import { Query } from './Query';
import { camelString } from './util/string-util';

export class World {
    _id = 0;
    _queries = [];
    _entities = new Map();

    constructor(engine) {
        this.engine = engine;
    }

    createId() {
        return ++this._id + Math.random().toString(36).substr(2, 9);
    }

    getEntity(id) {
        return this._entities.get(id);
    }

    createEntity(id = this.createId()) {
        const entity = new Entity(this, id);

        this._entities.set(id, entity);

        return entity;
    }

    destroyEntity(id) {
        const entity = this.getEntity(id);

        if (entity) {
            entity.destroy();
        }
    }

    createQuery(filters) {
        const query = new Query(this, filters);

        this._queries.push(query);

        return query;
    }

    createPrefab(name, properties = {}) {
        return this.engine._prefabs.create(this, name, properties);
    }

    serialize(entities) {
        const json = [];
        const list = entities || this._entities;

        list.forEach((e) => {
            json.push(e.serialize());
        });

        return {
            entities: json,
        };
    }

    deserialize(data) {
        for (const entityData of data.entities) {
            this._createOrGetEntityById(entityData.id);
        }

        for (const entityData of data.entities) {
            this._deserializeEntity(entityData);
        }
    }

    _createOrGetEntityById(id) {
        return this.getEntity(id) || this.createEntity(id);
    }

    _deserializeEntity(data) {
        const { id, ...components } = data;
        const entity = this._createOrGetEntityById(id);

        Object.entries(components).forEach(([key, value]) => {
            const type = camelString(key);
            const def = this.engine._components.get(type);

            if (def.allowMultiple) {
                Object.values(value).forEach((d) => {
                    entity.add(def, d);
                });
            } else {
                entity.add(def, value);
            }
        });
    }

    _candidate(entity) {
        this._queries.forEach((q) => q.candidate(entity));
    }

    _destroyed(id) {
        return this._entities.delete(id);
    }
}
