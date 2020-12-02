import { pascalString } from '../util/string-util';
import Entity from '../Entity';

export default class EntityRegistry {
    _entities = new Map();
    _ecs = null;
    _refs = new Map();

    constructor(ecs) {
        this._ecs = ecs;
    }

    get all() {
        return this._entities.values();
    }

    register(entity) {
        this._entities.set(entity.id, entity);

        return entity;
    }

    get(id) {
        return this._entities.get(id);
    }

    createOrGetById(id) {
        const entity = this.get(id);

        if (entity) {
            return entity;
        }

        return this.create(id);
    }

    create(id = undefined) {
        const entity = new Entity(this._ecs, id);

        this.register(entity);

        this._ecs.queries.onEntityCreated(entity);

        return entity;
    }

    destroy(entity) {
        entity.destroy();
    }

    onEntityDestroyed(entity) {
        this.cleanupRefs(entity);
        this._entities.delete(entity.id);
        this._ecs.queries.onEntityDestroyed(entity);
    }

    cleanupRefs(entity) {
        const refs = this._refs.get(entity.id);

        if (!refs) {
            return;
        }

        for (const ref of refs) {
            ref.cleanupReference(entity);
        }

        delete this._refs[entity.id];
    }

    addRef(entityId, property) {
        if (!this._refs.has(entityId)) {
            this._refs.set(entityId, new Set([property]));
            return;
        }

        this._refs.get(entityId).add(property);
    }

    removeRef(entityId, property) {
        if (this._refs.has(entityId)) {
            this._refs.get(entityId).delete(property);
        }
    }

    serialize(entities) {
        const json = [];
        const list = entities ? entities : this._entities;

        list.forEach((entity) => {
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
            const type = pascalString(key);
            const definition = this._ecs.components.get(type);

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
